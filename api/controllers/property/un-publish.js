module.exports = {
  friendlyName: 'Unpublish prop',
  description: 'Changes the status of a property',


  inputs: {
    id:{
      type:'string',
      description : 'prop id',
      required : true
    }
  },

  fn: function (inputs, exits,env) {
    console.log('ids',inputs.id);
    Property.update({id:inputs.id},{state : 'n'},(err,updated)=>{
      console.log(err,updated);
      if(err) return exits.error(err);
      return exits.success();
    });
  }


};
