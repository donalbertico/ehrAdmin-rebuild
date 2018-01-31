var ObjectID = require('mongodb').ObjectID;

function parseQuery(inputs){
  var query={};
  if(inputs.id){
    query['_id']=ObjectID(inputs.id);
  }
  if(inputs.title){
    query.title={'$regex':`.*${inputs.title}.*`};
  }
  if(inputs.state !== 'a'){
    query.state = inputs.state;
  }
  if (inputs.from && inputs.to) {
    query.createdAt = {'$gte' : inputs.from, '$lt' : inputs.to};
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
    id:{
      type:'string'
    },
    title:{
      type:'string'
    },
    state:{
      type:'string'
    },
    from:{
      type:'number'
    },
    to:{
      type:'number'
    },
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
    var col = User.getDatastore().manager.collection('property');
    console.log(query);
    col.find(query).toArray((err,props)=>{
      if(err){
        console.error(err);
        return exits.error({message:'server_error'});
      }
      props=props.map((item)=>{
        item.id=item._id.toHexString();
        delete item._id;
        return item;
      });
      return exits.success(props);
    });
  }


};
