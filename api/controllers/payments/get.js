module.exports = {


  friendlyName: 'get unverified payments',


  description: 'returns all unverified payments',


  inputs: {
  },


  exits: {

  },


  fn: function (inputs, exits,env) {
    Payments.find({verified : false}).populate('payer').exec((err,found)=>{
      if(err) return exits.error(err);
      return exits.success(found)
    });
  }


};
