var detailDic = require('./details');
  /**
 * Payments.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
 /**
 *
 *Object describing a tax rate. Uses the standar defined by SRI.
 *More info on http://www.sri.gob.ec/DocumentosAlfrescoPortlet/descargar/fbb05cf5-32f2-4cc3-bc8a-b539c9e0ed74/FICHA+TECNICA+COMPROBANTES+ELECTRO%B4NICOS+offline.pdf
 *
 *@typedef {Object} Tax
 *@property {!number} rate - rate related with the tax. Between 1 and 0.
 *@property {!string} name - name of the tax
 *@property {!string} code - SRI code used for this tax
 *@property {!string} rateCode - SRI code used to identify tax rate
 *@property {!string} value - Value for the tax aleady applied to the cointaining Item
 */
 /**
 *
 *Object describing a single item inside a bill's Detail
 *@typedef {Object} Item
 *@property {!number} qty - How manny of this items
 *@property {!string} description - Description for the item
 *@property {!string} code - Main code for this item, Must be unique for each type of item
 *@property {?string} altCode - Alternative code for this item
 *@property {!number} unitPrice - Price for esach item
 *@property {?number} discount - Discount applied to the current item. It's applied as a whole, not to the unitPrice
 *@property {number} total - Calculated value equal to qty*unitPrice - discount
 *@property {Tax[]} taxes - Array con2aining Taxes applied to the current item
 */
 /**
 *
 *An object describing the purchase.
 *@typedef {Object} Detail
 *@property {!Item[]} items - Items included into the current detail
 *@property {!number} total - Total for this purchase
 *@property {!number} totalTax - Total for this purchase
 */
/**
*
*/
module.exports = {
  attributes: {
    payer:{model:'User',required:true},
    bill:{model:'Bill'},
    amount:{type:'number'},
    type : {type: 'string'},
    details:{
      type:'json',
      required:true
    },
    method:{type:'string',isIn:['PayPal','Deposito Bancario']},
    verified:{type:'boolean',defaultsTo:false},
    verifiedAt:{type:'string', columnType: 'date'},
    transferNumber : {type: 'string',maxLength: 20, minLength : 1, defaultsTo:''},
    invoiced : {type: 'boolean',defaultsTo : false}
  },
  beforeCreate : (newRecord,next)=> {
    newRecord.details.forEach((detail,index)=>{
      newRecord.details[index] = detailDic.detailFromCode(detail.code,detail.qty,detail.discount);
    });
    next();
  },
  verify : (paymentId, cb) => {
    Payments.findOne(paymentId).populate('payer').exec((err,payment)=>{
        if(err) return cb(err);
        User.applyBenefits(payment.payer.id,payment.details,(err,benefType)=>{
          if(err) return cb(err);
          var bill = {
            payment:payment.id,
            name:payment.payer.paymentInfo.name,
            identifier:payment.payer.paymentInfo.identifier,
            address:payment.payer.paymentInfo.address,
            idType:payment.payer.paymentInfo.idType,
            email:payment.payer.email,
            details : payment.details
          };
          Bill.create(bill).meta({fetch:true}).exec((err,newBill)=>{
            if(err) return cb(err);
            Payments.update(payment.id,{verifiedAt: new Date ,verified:true,bill:newBill.id,amount:bill.total,type:benefType},(err)=>{
              if(err) return cb(err);
              sails.hooks.mail.send(
                                    'paymentAproved',
                                    {
                                      recipientName: payment.payer.firstName,
                                      type: benefType
                                    },
                                    {
                                      to: payment.payer.email,
                                      subject: 'Pago recivido'
                                    },
                                     function(err) {

                                      if(err) return cb(err);
                                      return cb();
                                     }
                                   );
            });
          });
        });
    });
  }
};
