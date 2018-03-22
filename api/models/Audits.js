var detailDic = require('../models/details');

/**
 * Audits.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore:'mongoAdmin',
  attributes: {
    product : {type : 'json', required : true},
    // type : { type: 'string',required : true},
    employee : { model: 'Admin'},
    //relationships
    user : { type: 'string'},
  },
  newDoc : (details,user,employee,type,next)=>{
    var product;
    if(details[0]){
      product = detailDic.detailFromCode(details[0].code);
    }else{
      product = {description : details.description};
    }
    Audits.create({employee:employee,product : product,user:user,type:type},(err,created)=>{
      if(err) {
        return next(err);
      };
      return next();
    });
  }
};
