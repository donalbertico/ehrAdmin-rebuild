module.exports = {


  friendlyName: 'delete prop',


  description: 'delete a prop with its id',


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
    Property.destroy(inputs.id).meta({fetch: true}).exec((err,deleted)=>{
      if(err) exits.error(err);
      console.log('caquita',deleted[0]);
      Audits.newDoc({description : 'propiedad borrada'},deleted[0].user,employee,'prop-deleted',(err)=>{
        if(err) {
          console.log(err);
          return exits.error(err);
        };
        return exits.success();
      });
    });
  }


};
