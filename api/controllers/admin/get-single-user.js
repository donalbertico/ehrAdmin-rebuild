var ObjectID = require('mongodb').ObjectID;
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
    var users = User.getDatastore().manager.collection('user');
    users.findOne({'_id':ObjectID(inputs.id)},(err,user)=>{
      if(err){
        console.error(err);
        return exits.error({message:'server_error'});
      }
      if(!user){
        return exits.conflict({message:'user_not_found'});
      }
      var resultUser= {
        id:user._id.toHexString(),
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        subscribedUntil:user.subscribedUntil,
        maxReco:user.maxReco,
        balance:user.balance.reduce((total,value)=>{return value+total;},0)
      }
      var recommendedIds=Object.keys(user.recommended).reduce((ids,singleId)=>{
        ids.push(ObjectID(singleId));
        return ids;
      },[]);
      if(recommendedIds.length>0){
        //Case: User has recommendeds
        users.find({'_id':{'$in':recommendedIds}}).toArray((err,recommended)=>{
          if(err){
            console.error(err);
            return exits.error({message:'server_error'});
          }
          resultUser.recommended=recommended.map((item)=>{
            return {
              id:item._id.toHexString(),
              firstName:item.firstName,
              lastName:item.lastName,
              email:item.id
            };
          });
          if(user.recommender){
            //Case: user has recommededs and reccommender
            users.findOne({'_id':ObjectID(user.recommender)},(err,recommender)=>{
              if(err){
                console.error(err);
                return exits.error({message:'server_error'});
              }
              resultUser.recommender={
                id:recommender._id.toHexString(),
                firstName:recommender.firstName,
                lastName:recommender.lastName,
                email:recommender.email
              }
              return exits.success(resultUser);
            });
          }else{
            //Case: user has only recommenders
            return exits.success(resultUser);
          }
        });
      }else{
        if(user.recommender){
          //Case: User only has recommender
          users.findOne({'_id':ObjectID(user.recommender)},(err,recommender)=>{
            if(err){
              console.error(err);
              return exits.error({message:'server_error'});
            }
            resultUser.recommender={
              id:recommender._id.toHexString(),
              firstName:recommender.firstName,
              lastName:recommender.lastName,
              email:recommender.email
            }
            return exits.success(resultUser);
          });
        }else{
          //Case:User has not recommder nor recommededs
          return exits.success(resultUser);
        }
      }
    });
  }


};
