module.exports = {


  friendlyName: 'Get statistics',


  description: 'Get statistics for the whole page',


  inputs: {

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
    var user = User.getDatastore().manager.collection('user');
    var payment = User.getDatastore().manager.collection('payment');
    var result={};
    user.count({},(err,totalUsers)=>{
      if(err){
        console.error(err);
        return exits.error({message:'server_error'});
      }
      result.users=totalUsers;
      user.count({subscribedUntil:{'$gt':new Date()}},(err,subsUsers)=>{
        if(err){
          console.error(err);
          return exits.error({message:'server_error'});
        }
        result.subsUsers=subsUsers;
        payment.count({},(err,totalPays)=>{
          if(err){
            console.error(err);
            return exits.error({message:'server_error'});
          }
          result.payments=totalPays;
          payment.count({'txStatus':'completed'},(err,completedPays)=>{
            if(err){
              console.error(err);
              return exits.error({message:'server_error'});
            }
            result.completePayments=completedPays;
            result.totalCollected=(completedPays*0.01);
            result.totalEarnings=(completedPays*0.0032);
            return exits.success(result);
          });
        });
      });
    });
  }


};
