module.exports = {


  friendlyName: 'delete user',


  description: 'delete a user with its id',


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


  fn: function (inputs, exits,env) {
    var employee = env.req.session.user;
    User.destroy(inputs.id).meta({fetch: true}).exec((err,destroyed)=>{
      if(err) exits.error(err);
      Audits.newDoc({description : 'usuario eliminadex'},destroyed[0].email,employee,'user-deleted',(err)=>{
        if(err) {
          console.log(err);
          return exits.error(err);
        };
        return exits.success();
      });
    });
  }


};
