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
  if(inputs.type == 'n'){
    query.collaborateWith = null;
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
    },
    type:{
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

    if(inputs.type == 'h' || inputs.type =='r' || inputs.type =='e'){
      var users = [];
      Enterprise.find({type : inputs.type}).populate('collaborators').populate('deputy').exec((err,enterprises)=>{
        if(err)return exits.error(err);
        enterprises.forEach((item)=>{
          users.push(item.deputy);
          item.collaborators.forEach((collaborator)=>{
            users.push(collaborator);
          });
        });
        exits.success(users);
      });
    }else{
      User.find(query).populate('properties').populate('passports').sort('createdAt DESC').exec((err,users)=>{
        if(err)return exits.error(err);
        exits.success(users);
      });
    }
  }
};
