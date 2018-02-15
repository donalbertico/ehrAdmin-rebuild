function parseQuery(inputs){
  var query={};
  if(inputs.email){
    query.email={'$regex':`.*${inputs.email}.*`};
  }
  if(inputs.firstName){
    query.firstName={'$regex':`.*${inputs.firstName}.*`};
  }
  if(inputs.lastName){
    query.lastName={'$regex':`.*${inputs.lastName}.*`};
  }
  if(Object.keys(query).length<1){
    return null;
  }
  return query;
}

module.exports = {


  friendlyName: 'Search users',


  description: 'Search users that have filelds like the inputs',


  inputs: {
    email:{
      type:'string'
    },
    firstName:{
      type:'string'
    },
    lastName:{
      type:'string'
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
    var query=parseQuery(inputs);
    if(!query){
      query={};
    }

    var col = User.getDatastore().manager.collection('user');
    var prop = User.getDatastore().manager.collection('property');
    col.find(query).toArray((err,users)=>{
      if(err){
        console.error(err);
        return exits.error({message:'server_error'});
      }
      users=users.map((item)=>{
        item.id=item._id.toHexString();
        delete item._id;
        return item;
      });
      return exits.success(users);
    });
  }


};
