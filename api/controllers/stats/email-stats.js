require('date-utils');
/*
*
*Gets the date from last month or week
*
*/

function getFromDate(type){
  var today = new Date();
  var day = 0;
  switch (type) {
    case 'week':
      day = today.getDay() || 7;
      if( day !== 1 )
        today.setHours(-24 * (day - 1));
      break;
    case 'month':
      today.setDate(1);
      break;
  }
  return new Date(today.getTime());
}
module.exports = {


  friendlyName: 'Get Email Stats',


  description: 'Gets the statistics about the emails that have been sent throug the platform',


  inputs: {
    time:{
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
    }
  },


  fn: function (inputs, exits,env) {
    var fromDate=getFromDate(inputs.time);
    Stats.find({type:['userInfoRequest','userRequestProvide'],createdAt:{'>':fromDate.getTime()}}).exec((err,results)=>{
      if(err)return exits.error('server_error');
      var stats={
        userInfoRequests:0,
        requestMessages:0,
        userInfoAddresses:0,
        requestAddresses:0,
        props:0
      };
      var userInfoEmails={},
          requestEmails={},
          props={};
      results.forEach((record)=>{
        if(record.type==='userInfoRequest'){
          stats.userInfoRequests++;
          if(!props[record.data.email]){
            stats.props++;
            props[record.data.email]=true;
          }
          if(!userInfoEmails[record.data.email]){
            stats.userInfoAddresses++;
            userInfoEmails[record.data.email]=true;
          }
        }else if(record.type==='userRequestProvide'){
          stats.requestMessages++;
          if(!requestEmails[record.data.email]){
            stats.requestAddresses++;
            requestEmails[record.data.email]=true;
          }
        }
      });
      return exits.success(stats);
    });
  }


};
