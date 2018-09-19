/**
*Request Model
*
*
*Request
*@typedef {Object} Request
*@property {String} propertyType - One of the properties types defined on Property.type
*@property {Number} priceReference - Aproximated price the user is looking for
*@property {Array} placesIds - Array containing google places ID that correspond with the location
*@property {String} place - Name of the place where the user is looking for properties.
*@property {String} comment- Some commentary the user wants to leave.
*@property {Object} contactInfo - This object contains the info where the property's owner should contact the user
*@property {String} contactInfo.name - User's name
*@property {String} contactInfo.email - User's email
*@property {String} contactInfo.phone - User's phone
*@property {Object} suggestedProps - This object contains all the ids from the properties that have already been suggested to this user

*/
var cloudinary = require('cloudinary');

module.exports = {
  attributes: {
    propertyType: {type: 'string'},
    priceReference: {type: 'number'},
    placesIds:{type:'json'},
    place: {type : 'string'},
    comment: {type : 'string'},
    contactInfo : {type :'json'},
    suggestedProps: {type:'json'}
  }
};
