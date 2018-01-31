module.exports = {


  friendlyName: 'Get statistics from props',


  description: 'Get statistics from props',


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
    var prop = User.getDatastore().manager.collection('property');
    var result={};
    prop.count({},(err,total)=>{
      if(err){
        console.error(err);
        return exits.error({message:'server_error'});
      }
      result.total=total;
      prop.count({state:'v'},(err,published)=>{
        if(err){
          console.error(err);
          return exits.error({message:'server_error'});
        }
        result.published=published;
        prop.count({state:'n'},(err,noPublish)=>{
          if(err){
            console.error(err);
            return exits.error({message:'server_error'});
          }
          result.noPublish=noPublish;
          prop.count({state:'p'},(err,pendent)=>{
            if(err){
              console.error(err);
              return exits.error({message:'server_error'});
            }
            result.pendent=pendent;
            return exits.success(result);
          });
        });
      });
    });
  }


};
