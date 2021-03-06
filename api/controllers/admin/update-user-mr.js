var ObjectID = require('mongodb').ObjectID;
module.exports = {


  friendlyName: 'Update user mr',


  description: 'Updated user maximum recommendeds',


  inputs: {
    id:{
      type:'string',
      required:true
    },
    newMr:{
      type:'number',
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
    var col = User.getDatastore().manager.collection('user');
    col.update({'_id':ObjectID(inputs.id)},{'$set':{maxReco:inputs.newMr}},(err,res)=>{
      if(err){
        return exits.error({message:'server_error'});
      }
      return exits.success();
    });
  }


};
