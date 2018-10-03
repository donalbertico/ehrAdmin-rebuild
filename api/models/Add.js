/**
 * Add.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title:{type:'string',required:true},
    type:{type:'string',required:true},
    description:{type:'string',required:true},
    contactEmail:{type:'string',required:true},
    url:{type:'string',allowNull:true},
    photoPublicId:{type:'string',allowNull:true},
    published:{type:'boolean',defaultsTo:false},
    place:{type:'string',required:true},
    location:{type:'json',defaultsTo:{latitude:0,longitude:0}}
  },

};
