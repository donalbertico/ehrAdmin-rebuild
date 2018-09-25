module.exports = {


  friendlyName: 'Search',


  description: 'Search add.',


  inputs: {

  },


  exits: {
    error:{
      statusCode:500
    },
    success:{
      statusCode:200
    }
  },


  fn: function (inputs, exits) {
    
    Add.find().exec((err,adds)=>{
      if(err)return exits.error(err);
      exits.success(adds);
    });

  }


};
