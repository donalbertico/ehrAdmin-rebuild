var cloudinaryConfig=sails.config.custom.cloudinary,
    cloudinary = require('cloudinary');
cloudinary.config(cloudinaryConfig);

const checkAndUpdate=(inputs,exits)=>{
  cloudinary.v2.api.resources({public_ids:inputs.publicId,max_results:1},(error, result)=>{
    if(error)return exits.error(error);
    if(result.resources.length===1&&result.resources[0].public_id===inputs.publicId){
      Add.update(inputs.id,{photoPublicId:inputs.publicId}).meta({fetch:true}).exec((err,updated)=>{
        if(err)return exits.error(err);
        return exits.success(updated[0]);
      });
    }else{
      return exits.conflict({message:'image_does_not_exists'})
    }
  });
};

const checkDestroyAndUpdate=(inputs,exits,add)=>{
  cloudinary.v2.api.resources({public_ids:inputs.publicId,max_results:1},(error, result)=>{
    if(error)return exits.error(error);
    if(result.resources.length===1&&result.resources[0].public_id===inputs.publicId){
      cloudinary.v2.uploader.destroy(add.photoPublicId, (error, result)=>{
        if(err)return exits.error(error);
        Add.update(inputs.id,{photoPublicId:inputs.publicId}).meta({fetch:true}).exec((err,updated)=>{
          if(err)return exits.error(err);
          return exits.success(updated[0]);
        });
      });
    }else{
      return exits.conflict({message:'image_does_not_exists'})
    }
  });
};

module.exports = {


  friendlyName: 'Update image',


  description: 'Checks if the publicId exists on cloudinary and updates the photoPublicId accordingly',


  inputs: {
    publicId:{
      type:'string',
      required:true
    },
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
    Add.findOne(inputs.id).exec((err,add)=>{
      if(err)return exits.error(err);
      if(!add)return exits.conflict({message:'add_does_not_exists'});
      if(add.photoPublicId){
        checkDestroyAndUpdate(inputs,exits,add);
      }else{
        checkAndUpdate(inputs,exits);
      }
    });
  }


};
