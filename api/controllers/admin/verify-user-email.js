module.exports = {


  friendlyName: 'verify user email',


  description: 'verify user given id',


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
    User.update(inputs.id,{mailVerified : true},(err)=>{
      console.log(err);
      if(err) exits.error(err);
      return exits.success();
    });
  }


};
