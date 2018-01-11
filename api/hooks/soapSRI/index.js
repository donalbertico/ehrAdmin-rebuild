var soap=require('soap');
var bill = sails.config.custom.bill;

module.exports = (sails)=>{
  var enviarComprobante = (comprobante,next) => {
  	var options = {
         ignoredNamespaces: {
            namespaces: ['targetNamespace', 'typedNamespace'],
            override: true
          }
      };
  	soap.createClient(bill.recepUrl,options,function(err,client){
  		if(err){
  			console.log({message:'Servidor SRI down',error:err});
  			return next({error:'SRI_server_down'});
  		}
  		var comp=comprobante.replace('\"','"');
  		comp = (new Buffer(comp)).toString('base64');
  		client.validarComprobante({xml:{'$value':comp}},function(err,result){
  			if(err){
  				console.log({message:'Servidor de SRI en mantenimiento',error:err});
  				return next({error:'SRI_maitainance'});
  			}
  			if(result.RespuestaRecepcionComprobante.estado=="RECIBIDA"){
  					return next(null,true);
  				}else{
  					console.log({message:'Factura Rechazada',result:result});
            console.log(result.RespuestaRecepcionComprobante.comprobantes.comprobante);
  					return next({error:'rejected_bill'});
  				}
  		});
  	});
  }

  var autorizarComprobante = (claveAcceso,next) => {
  	var options = {
         ignoredNamespaces: {
            namespaces: ['targetNamespace', 'typedNamespace'],
            override: true
          }
      };
  	soap.createClient(bill.autoUrl,options,function(err,client){
  		if(err){
  			console.log({message:'Servidor SRI down',error:err});
  			return next({error:'SRI_server_down'});
  		}
  		client.autorizacionComprobante({claveAccesoComprobante:claveAcceso},function(err,result,raw){
  			if(err){
  				console.log({message:'Servidor SRI en mantenimiento',error:err});
  				return next({error:'SRI_maitainance'});
  			}
  			if(result.RespuestaAutorizacionComprobante.numeroComprobantes=='0'){
  				console.log({message:'No se autorizó ningún comprobante',result:result});
  				return next({error:'no_receipt_authorized'});
  			}
  			var aut=result.RespuestaAutorizacionComprobante.autorizaciones.autorizacion;
  			if(aut.estado=="AUTORIZADO"){
         	return next(null,aut.numeroAutorizacion);
        }else{
          console.log({message:'El comprobante numero:'+claveAcceso+' tuvo problemas de autorización'});
          console.log({message:'Respuesta:',response:aut.mensajes});
          return next({error:'receipt_not_authorized'});
        }
  		});
  	});
  };

  return {
    send : enviarComprobante,
    authorize : autorizarComprobante
  }
};
