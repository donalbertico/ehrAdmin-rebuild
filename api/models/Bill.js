/**
 * Bill.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
require('date-utils');
var random = require('randomstring');
var billInfo=sails.config.custom.bill;
var checkDigit = require('checkdigit');

/**
*Returns the corresponding digit 11 of a n input (mod 11)
*
*@param {string} n - The string of numbers to calculate digit 11
*/
/**
*Returns the n string padded with the z character until the width is reached
*
*@param {string} n - The string of numbers to pad
*@param {string} width - The witdh wanted
*@param {string} z - The caracter to fill with
*
*/
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
module.exports = {
  attributes: {
    payment:{model:'Payments'},
		secuence:{type:'number'},
		emisionPoint:{type:'number'},
		name:{type:'string',required:true},
		address:{type:'string',defaultsTo:''},
		identifier:{type:'string',required:true},
		idType:{type:'string',isIn:['06','04','05','07'],required:true},//06: passport, 04:ruc, 05:cedulas,07:Consumidor Final
		email:{type:'string',required:true},
		numericCode:{type:'string'},
		accessKey:{type:'string'},
		autNumber:{type:'string',defaultsTo:''},
		details:{type:'json'},
    total:{type:'number'},
    taxTotal:{type :'number'}
  },
	toSRIFormat: (bill)=>{
		var detalles=[],taxes={},subTotal=0,discSubTotal=0,taxTotal=0;
       bill.details.forEach((item,index)=>{
         var det = {
 									codigoPrincipal:item.code,
 									descripcion:item.description,
 									cantidad:item.qty,
 									precioUnitario:(item.unitPrice).toFixed(2),
 									descuento:item.discount,
 									precioTotalSinImpuesto:item.subtotal,
 									impuestos:{
 										impuesto:[]
 									}
 								};
        subTotal +=item.subtotal;
        discSubTotal +=item.discount;
        item.taxes.forEach((tax)=>{
          var imp = {
            codigo:tax.code,
            codigoPorcentaje:tax.rateCode,
            tarifa:tax.rate,
            baseImponible:(tax.priceBase).toFixed(2),
            valor:tax.value
          };
	        if(taxes[tax.code]){
	          taxes[tax.code].baseImponible+=imp.baseImponible;
	          taxes[tax.code].valor+=imp.valor;
	        }else{
	          taxes[tax.code]={
	            codigo:imp.codigo,
	            codigoPorcentaje:imp.codigoPorcentaje,
	            baseImponible:(imp.baseImponible),
	            valor:imp.valor
	          };
	        }
					taxTotal += tax.value;
          det.impuestos.impuesto.push(imp);
        });
        detalles.push(det);
      });
      var taxArr=[];
      Object.keys(taxes).forEach((key)=>{
        taxArr.push(taxes[key]);
      });
      var factura={
 			'factura':{
 				'$':{id:'comprobante',version:'1.0.0'},
 				infoTributaria:{
 					ambiente:billInfo.ambiente,
 					tipoEmision:'1',
 					razonSocial:billInfo.razonSocial,
 					nombreComercial:billInfo.nombreComercial,
 					ruc:billInfo.ruc,
 					claveAcceso:bill.accessKey,
 					codDoc:'01',
 					estab:billInfo.establecimiento,
 					ptoEmi:pad(bill.emisionPoint,3),
 					secuencial:pad(bill.secuence,9),
 					dirMatriz:billInfo.dirMatriz
 				},
 				infoFactura:{
 					fechaEmision:(new Date()).toFormat('DD/MM/YYYY'),
 					obligadoContabilidad:"SI",
 					tipoIdentificacionComprador:bill.idType,
 					razonSocialComprador:bill.name,
 					identificacionComprador:bill.identifier,
 					totalSinImpuestos:(subTotal).toFixed(2),
 					totalDescuento:0,
 					totalConImpuestos:{
 						totalImpuesto:taxArr
 					},
 					propina:0,
 					importeTotal:bill.total
 				},
 				detalles:{
 					detalle:detalles
 				},
 				infoAdicional:{
 					campoAdicional:[]
 					}
 				}
 			};
      if(bill.email){
        factura['factura'].infoAdicional.campoAdicional.push({
                                    '$':{
                                      'nombre':'email'
                                    },
                                    '_':bill.email
                                  });
      }
      if(bill.address){
        factura['factura'].infoAdicional.campoAdicional.push({
                                    '$':{
                                      'nombre':'direccion'
                                    },
                                    '_':bill.address
                                  });
      }
      if(factura['factura'].infoAdicional.campoAdicional.length<1){
        delete factura['factura'].infoAdicional;
      }
      return factura;
	},
	beforeCreate : (newRecord,next)=>{
		Bill.find({sort:'createdAt DESC',limit:1}).exec((err,bills)=>{
			if(err)return next(err);
			var last = bills[0];
			if(last){
				var created = new Date(last.createdAt);
				if(Date.today().getYear()>created.getYear()){
					newRecord.secuence=1;
					newRecord.emisionPoint=2;
				}else{
					if(last.secuence>=999999999){
						newRecord.secuence=1;
						newRecord.emisionPoint=last.emisionPoint+1;
					}else{
						newRecord.secuence= last.secuence+1;
						newRecord.emisionPoint=last.emisionPoint;
					}
				}
			}else{
				newRecord.emisionPoint=2;
				newRecord.secuence=1;
			}
      var total = 0;
      var taxTotal = 0;
      newRecord.details.forEach((detail)=>{
        total += detail.total;
        detail.taxes.forEach((tax)=>{
          taxTotal += tax.value;
        });
      });
      newRecord.total = total;
      newRecord.taxTotal = Number(taxTotal);
			newRecord.numericCode = random.generate({length:8,charset:'numeric'});
			newRecord.accessKey = Date.today().toFormat('DDMMYYYY')+'01'+billInfo.ruc+billInfo.ambiente+billInfo.establecimiento+pad(newRecord.emisionPoint,3)+pad(newRecord.secuence,9)+newRecord.numericCode+'1';
			newRecord.accessKey = checkDigit.mod11.apply(newRecord.accessKey);
			return next();
		});
	},
	afterCreate:(createdRecord,next) => {
		Bill.findOne(createdRecord.id).populate('payment').exec((err,bill)=>{
			var factura = Bill.toSRIFormat(bill);
			sails.hooks.xmlsign.sign(factura,(err,signed)=>{
        console.log(err, 'ERROR FIRMANDO?');
       if(err) return next(err);
       sails.hooks.soapsri.send(signed,(err)=>{
         console.log(err, 'HAY ERROR CREANDO');
				 if(err) return next(err);
         sails.hooks.s3service.upload('factura',bill.accessKey+'.xml',signed,(err)=>{
           console.log(err, 'ERRO SUBIENDO');
           if(err)return next(err);
           Bill.update(bill.id,{sent : true},(err)=>{
             if(err)return next(err);
             next();
           });
         });
			});
     });
		});
	}
};
