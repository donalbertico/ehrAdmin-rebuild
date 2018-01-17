var detailDic = require('../../models/details');
module.exports = {


  friendlyName: 'verify',


  description: 'verify a payment',


  inputs: {
    payment : {
      description : 'payment id to verify',
      type : 'string',
      required : true
    },
    code : {
      description : 'product code',
      type : 'string',
      required : true
    }
  },


  exits: {

  },


  fn: function (inputs, exits,env) {
    var prod = detailDic.detailFromCode(inputs.code);
    Payments.update({id : inputs.payment},{details : [prod]}).exec((err,found)=>{
      if(err) return exits.error(err);
      Payments.verify(inputs.payment,(err)=>{
        if(err) return exits.error(err);
        return exits.success();
      })
    });
  }


};
