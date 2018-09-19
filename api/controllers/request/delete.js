module.exports = {


  friendlyName: 'Delete Request',


  description: 'Delete a request with submitted id',


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
    Request.destroy(inputs.id).exec((err,deleted)=>{
      if(err) exits.error(err);
      exits.success();
    });
  }


};
