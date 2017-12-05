
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
    User.applyBenefits(inputs.user,[{code:inputs.code}],(err)=>{
      if (err) {
        return exits.error(err);
      }
      exits.success();
    });
  }
};
