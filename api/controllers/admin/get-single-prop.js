module.exports = {


  friendlyName: 'Get single prop',


  description: 'Gets all the info for a single property',


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
    Property.findOne(inputs.id).populate('owner').exec((err,found)=>{
      if(err) exits.error(err);
      return exits.success(found);
    });
  }


};
