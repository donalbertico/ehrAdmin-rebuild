module.exports = {


  friendlyName: 'Search audits',


  description: 'Search audits',


  inputs: {

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
    Audits.find({}).populate('employee').exec((err,audits)=>{
      if(err)return exits.error(err);
      return exits.success(audits);
    });

  }


};
