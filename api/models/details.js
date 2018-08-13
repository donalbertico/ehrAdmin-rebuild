/**
*Details from code
*
*the function will return an array of details object
*
*/
var quick = require('node-quickbooks');
var request = require('request');
var qb_key = sails.config.custom.qb_config.consumerKey;
var qb_secret = sails.config.custom.qb_config.consumerSecret;
var qb = new quick (qb_key,
                         qb_secret,
                         sails.config.custom.qb_config.token,
                         sails.config.custom.qb_config.secret,
                         sails.config.custom.qb_config.realmId,
                         sails.config.custom.qb_config.qbTest, // use the sandbox (i.e. for testing)
                         false);
const iva = {
  code : '2',
  rateCode : '3',
  rate : 12
}
const detailDic = {};
var customer = {}
    methods = {}
    accounts = {}
    taxes = {};

qb.findItems([{field:'type',value:'Service'}], (err, response)=>{
  if(err) throw err;
  response.QueryResponse.Item.forEach((product)=>{
    if(!product.Sku) return;
    var unitPrice = parseInt(product.UnitPrice / (1 - (iva.rate/100)));
    var tax = {
      priceBase : product.UnitPrice,
      value : (unitPrice*(iva.rate/100)).toFixed(2),
      code : iva.code,
      rate : iva.rate,
      rateCode : iva.rateCode
    }
    detailDic[product.Sku] = {
      name : product.Name,
      description : product.Description,
      unitPrice : unitPrice,
      code : product.Sku,
      id : product.id
    };
    detailDic[product.Sku].taxes = [tax];
  });
});


module.exports = {
  /**
  *
  *Recives a code and translated to a complete detail object calculating the taxes
  *
  *@property {String} code product code to get info
  *@property {String} qty quantity pruchased
  *@property {String} discount discount applayed on product
  *
  *
  **/
  detailFromCode : (code,qty,discount)=>{
    var detail = detailDic[code];
    var taxTotal = 0;
    detail.taxes.forEach((item)=>{
      taxTotal += item.value;
    });
    detail['qty'] = qty || 1;
    detail['discount'] = discount || 0;
    detail['subtotal'] = (detail.qty*detail.unitPrice) - detail.discount - taxTotal;
    detail['total'] = detail.unitPrice*detail.qty - detail.discount;
    detail['taxTotal'] = taxTotal;
    if(code.substring(0,2)==='PL'){
      detail['type'] = 'plan';
    }else if(code.substring(0,2)==='TO'){
      detail['type'] = 'token';
    }else{
      detail['type'] = 'plusannouncer';
    }
    return detail;
  },
  /**
  *
  *Recives a code and return an object for updating to the payer
  *
  *@property {String} code product code to get info
  *
  *
  **/
  benefitsFromCode : (code)=>{
    var prod = detailDic[code];
    var benefits = {};
    if(code.substring(0,2)==='PL'){
      benefits['type'] = 'plan';
      var date = new Date();
      switch (prod.unitPrice) {
        case 3:
          benefits['add'] = {days:1}
          break;
        case 5:
          benefits['add'] = {days:7}
          break;
        case 10:
          benefits['add'] = {months:1}
          break;
      }
    }else if(code.substring(0,2)==='TO'){
      benefits['type'] = 'token';
      switch (prod.code){
        case 'TO001':
          benefits['add'] = {tokens:1}
          break;
        case 'TO002':
          benefits['add'] = {tokens:10}
          break;
        case 'TO003':
          benefits['add'] = {tokens:25}
          break;
        case 'TO004':
          benefits['add'] = {tokens:50}
          break;
      }
    }else{
      benefits['type'] = 'plusannouncer';
      switch (prod.code) {
        case 'AP001':
          benefits['add'] = {days:7};
          break;
        case 'AP002':
          benefits['add'] = {months:1};
          break;
        case 'AP003':
          benefits['add'] = {days:365};
          break;
      }
    }
    return benefits;
  }
};
