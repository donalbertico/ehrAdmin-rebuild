/**
 * Stats.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
/**
 *
 *Object containing diffrent data about instrested users.
 *@typedef {Object} Stat
 *@property {!string} type - type of stat to be stored
 *@property {!Object} data - data to be stored
 */
module.exports = {

  attributes: {
    type:{type:'string',required:true},
    data:{type:'json',defaultsTo:null}
  }

};
