require('date-utils');
/*
*Gets the query for this action and parses into a nodejs mongo driver query
*/

function parseQuery(query){
  var result={};
  if(query.from){
    var from = (new Date(query.from)).add({hours:4});
    result.createdAt=Object.assign({},result.createdAt,{'$gt':from.getTime()});
  }
  if(query.to){
    var to = (new Date(query.to)).add({hours:24});
    result.createdAt=Object.assign({},result.createdAt,{'$lt':to.getTime()});
  }
  if(query.place){
    result.place={ '$regex': new RegExp(`^${query.place}`)}
  }
  return result;
};

var json2csv = require('json2csv');

module.exports = {


  friendlyName: 'Search requests',


  description: 'Search requests accordingly to certain filters',


  inputs: {
    from:{
      type:'string'
    },
    to:{
      type:'string'
    },
    place:{
      type:'string'
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
    var datastore = Stats.getDatastore().manager;
    datastore.collection('request').find(parseQuery(inputs)).toArray((err,results)=>{
      if(err)return exits.error({message:'server_error'});
      results=results.map((record)=>{
        record.id=record._id;
        delete record._id;
        record.date=(new Date(record.createdAt)).toFormat('DD-MM-YYYY');
        return record;
      });
      return exits.success(results);
    });
  }


};
