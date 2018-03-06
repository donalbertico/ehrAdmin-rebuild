function parseQuery(inputs){
  var query={};
  if(inputs.email){
    query.email=inputs.email;
  }
  if(inputs.firstName){
    query.firstName=inputs.firstName;
  }
  if(inputs.lastName){
    query.lastName=inputs.lastName;
  }
  if (inputs.from && inputs.to) {
    query.createdAt = {'>' : inputs.from, '<' : inputs.to};
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
    },
    from :{
      type :'number'
    },
    to :{
      type :'number'
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
    console.log('searching',inputs);

    var query=parseQuery(inputs);
    console.log(query);
    if(!query){
      query={};
    }
    User.find(query).populate('properties').populate('passports').sort('createdAt DESC').exec((err,users)=>{
      console.log(err);
      if(err)return exits.error(err);
      exits.success(users);
    });
  }


};
