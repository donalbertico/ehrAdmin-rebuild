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
    User.findOne(inputs.id).populate('properties').populate('enterprise').populate('payments').exec((err,found)=>{
      if(err) exits.error(err);
      found.isPlus = User.isPlus(found);
      if(found.collaborateWith){
        Enterprise.findOne(found.collaborateWith,(err,enterprise)=>{
          if(err) exits.error(err);
          found.enterprise = enterprise;
          return exits.success(found);
        });
      }else{
        found.enterprise = found.enterprise[0];
        return exits.success(found);
      }
    });
  }


};
