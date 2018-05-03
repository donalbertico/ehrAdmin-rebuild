require('date-utils');
/*
*Gets the query for this action and parses into a nodejs mongo driver query
*/

function parseQuery(query){
  var result={type:'userInfoRequest'};

  if(query.from){
    var from = (new Date(query.from)).add({hours:4});
    result.createdAt=Object.assign({},result.createdAt,{'$gt':from.getTime()});
  }
  if(query.to){
    var to = (new Date(query.to)).add({hours:4});
    result.createdAt=Object.assign({},result.createdAt,{'$lt':to.getTime()});
  }
  if(query.email){
    result['data.email']={ '$regex': new RegExp(`^${query.email}`)}
  }
  if(query.city){
    result['data.propInfo.city']=  { '$regex': new RegExp(`^${query.city}`)}
  }
  console.log(query,result);
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
    },
    city:{
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
          var record = {
            name:item.data.name,
            email:item.data.email,
            date:(new Date(item.createdAt)).toFormat('DD-MM-YYYY'),
            phone:item.data.phone
          };
          if(item.data.propInfo){
            record = Object.assign(record,{city:item.data.propInfo.city,locality:item.data.propInfo.locality})
          }
          res.push(record);
          emails[item.data.email]=true;
        }
        return res;
      },[]);
      if(env.req.wantsJSON){
        return exits.success(results);
      }else{
        env.res.setHeader('Content-Type', 'text/csv');
        return exits.success(json2csv({ data: results, fields: ['name','email','date','phone','city','locality'] }));
      }


    });
  }


};
