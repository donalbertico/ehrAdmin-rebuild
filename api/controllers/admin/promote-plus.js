
module.exports = {

  friendlyName: 'promote user to plus',

  description: 'Adds time to plus until field on user',

  inputs: {
    user : {
      description : 'user id to promote',
      type : 'string',
      required : true
    },
    code : {
      description : 'product code',
      type : 'string',
      required : true
    }
  },

  fn: function (inputs, exits,env) {
    var payment = {
      payer : inputs.user,
      method : 'Deposito Bancario',
      details : [{code:inputs.code,}]
    }
    Payments.create(payment).meta({fetch:true}).exec((err,created)=>{
      if(err) return exits.error(err);
        Payments.verify(created.id,(response)=>{
          return exits.success();
        });
    });
  }
};
