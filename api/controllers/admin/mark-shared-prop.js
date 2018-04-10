module.exports = {


  friendlyName: 'mark prop as shared',


  description: 'set shared attribute to true of given id',


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
    Property.update(inputs.id,{shared : true},(err)=>{
      if(err) exits.error(err);
      return exits.success();
    });
  }


};
