module.exports = {


  friendlyName: 'Get single user',


  description: 'Gets all the info for a single user',


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
    User.findOne(inputs.id).populate('properties').exec((err,found)=>{
      if(err) exits.error(err);
      console.log(found);
      return exits.success(found);
    });
  }


};
