/**
*Enterprise Model
*
*
*Enterprise
*@typedef {Object} Enterprise
*@property {String} name
*@property {String} type could be {e: realtors enterprise, r: realtor,h : hotel}
*@property {String} enterprise deputy from user model
*@property {Object} location - Extra info provided by the user
*@property {String} location.address - Srteets and specifications where enterprise is located.
*@property {String} location.city - City where the enterprise is located.
*@property {String} location.country - Country where the enterprise is located.
*/  
module.exports = {
  attributes: {
    name : {type : 'string', maxLength: 50,unique : true, required: true},
    type: {type: 'string', maxLength: 1,isIn:['r','e','h']},// could be {e: realtors enterprise, r: realtor,h : hotel}
    deputy : {model :'user',unique : true,required : true},
    location : {
      type : 'json',
      defaultsTo:{
        city:null,
        placeId:null,
        address:null
      }
    },
    image : {type: 'string',allowNull:true},
    collaborators : {
      collection : 'user',
      via : 'collaborateWith'
    }
  },
  afterDestroy : function(destroyedRecords,next){
    if(!destroyedRecords.image)return next();
    var imgUrl = destroyedRecords.image.split('/');
    var img = imgUrl[imgUrl.length -1].split('.')[0];
    cloudinary.api.delete_resources(img);
    next();
  }
};
