/*
*Gets the query for this action and parses into a nodejs mongo driver query
*/

function parseQuery(query){
  var result={type:'userInfoRequest'};
  if(query.from){
    var from = new Date(query.from);
    result.createdAt=Object.assign({},result.createdAt,{'$gt':from.getTime()});
  }
  if(query.to){
    var to = new Date(query.to);
    result.createdAt=Object.assign({},result.createdAt,{'$lt':to.getTime()});
  }
  if(query.email){
    result['data.email']={ '$regex': new RegExp(`^${query.email}`)}
  }
  return result;
};

var json2csv = require('json2csv');

module.exports = {


  friendlyName: 'Get Emails List',


  description: 'Search userInfoRequest Stats that match the query and returns the emails and information contained in them ',


  inputs: {
    from:{
      type:'string'
    },
    to:{
      type:'string'
    },
    email:{
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
    datastore.collection('stats').find(parseQuery(inputs)).toArray((err,results)=>{
      if(err)return exits.error({message:'server_error'});
      var emails={};
      results=results.reduce((res,item)=>{
        if(!emails[item.data.email]){
          res.push({
            name:item.data.name,
            email:item.data.email,
            date:(new Date(item.createdAt)).toFormat('DD-MM-YYYY'),
            phone:item.data.phone
          });
          emails[item.data.email]=true;
        }
        return res;
      },[]);
      if(env.req.wantsJSON){
        return exits.success(results);
      }else{
        env.res.setHeader('Content-Type', 'text/csv');
        return exits.success(json2csv({ data: results, fields: ['name','email','date','phone'] }));
      }


    });
  }


};
