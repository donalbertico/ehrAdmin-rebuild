module.exports = {


  friendlyName: 'delete payment',


  description: 'delete a payment with its id',


  inputs: {
    id:{
      type:'string',
      required:true
    }
  },


  exits: {
    error:{
      statusCode:500
    },
    success:{
      statusCode:200
    },
    conflict:{
      statusCode:409
    }
  },


  fn: function (inputs, exits) {
    Payments.destroy(inputs.id).meta({fetch: true}).exec((err)=>{
      if(err) exits.error(err);
      return exits.success();
    });
  }


};
