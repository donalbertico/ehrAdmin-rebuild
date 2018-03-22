module.exports = {


  friendlyName: 'Login',


  description: 'Login admin.',


  inputs: {
    username:{
      type:'string',
      required:true
    },
    password:{
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
    Admin.findOne({username:inputs.username},(err,found)=>{
      if(err){
        console.error(err);
        return exits.error({message:'server_error'});
      }
      if(!found){
        return exits.conflict({message:'user_or_pass_invalid'});
      }
      Admin.validatePassword(inputs.password,found.password,(err,valid)=>{
        if(err){
          console.error(err);
          return exits.error({message:'server_error'});
        }
        if(!valid){
          return exits.conflict({message:'user_or_pass_invalid'});
        }
        env.req.session.user = found.id;
        env.req.session.authenticated = true;
        env.res.cookie('authenticated', '1', { maxAge: 2 * 24 * 60 * 60 * 1000});
        env.res.cookie('user', found.id, { maxAge: 2 * 24 * 60 * 60 * 1000});
        return exits.success();
      })
    });
  }


};
