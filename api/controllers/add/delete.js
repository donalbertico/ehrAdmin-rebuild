var cloudinaryConfig=sails.config.custom.cloudinary,
    cloudinary = require('cloudinary');
cloudinary.config(cloudinaryConfig);
module.exports = {


  friendlyName: 'Delete',


  description: 'Delete add.',


  inputs: {
    id:{type:'string',required:true}
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

    Add.findOne(inputs.id).exec((err,add)=>{
      if(err)return exits.error(err);
      if(!add)return exits.conflict({message:'add_not_found'});
      if(add.photoPublicId){
        cloudinary.v2.uploader.destroy(add.photoPublicId, (error, result)=>{
          if(err)return exits.error(error);
          Add.destroy(inputs.id).exec((err)=>{
            if(err)return exits(err);
            return exits.success()
          });
        });
      }else{
        Add.destroy(inputs.id).exec((err)=>{
          if(err)return exits(err);
          return exits.success()
        });
      }

    });


  }


};
