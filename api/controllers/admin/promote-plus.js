
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
    var employee = env.req.session.user;
    Payments.create(payment).meta({fetch:true}).exec((err,created)=>{
      if(err) return exits.error(err);
        Payments.verify(created.id,(err,response)=>{
          if(err) return exits.error(err);
          Audits.newDoc(payment.details,inputs.user,employee,'payment-verified',(err)=>{
            if(err) {
              console.log(err);
              return exits.error(err);
            };
            return exits.success();
          });
        });
    });
  }
};
