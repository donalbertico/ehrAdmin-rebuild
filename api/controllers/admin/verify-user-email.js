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
    User.update(inputs.id,{mailVerified:true},function(err,updated){
        if(err){
          console.log(err);
          return exits.error({message:'server_error'});
        }
        var newDates=[Date.today().getTime()];
        Property.update({owner:inputs.id,state:'p'},{state:'v',publishedDates:newDates},(err,updatedProps)=>{
          if(err){
            return exits.error({message:'server_error'});
          }
          return exits.success();
        });
      });
  }


};
