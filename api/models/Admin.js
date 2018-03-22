var bcrypt = require('bcryptjs');

/**
 * Hash a passport password.
 *
 * @param {Object}   password
 * @param {Function} next
 */
function hashPassword (admin, next) {
  if (admin.password) {
    bcrypt.hash(admin.password, 10, function (err, hash) {
      admin.password = hash;
      next(err, admin);
    });
  } else {
    next(null, admin);
  }
}


/**
 * Admin.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore:'mongoAdmin',
  attributes: {
    username:{type:'string',unique:true},
    password:{type:'string'},
    audits:{collection:'Audits',via:'user'}
  },
  validatePassword: function (password,encrypted, next) {
    bcrypt.compare(password, encrypted, next);
  },
  /**
   * Callback to be run before creating a Passport.
   *
   * @param {Object}   admin The soon-to-be-created Admin
   * @param {Function} next
   */
  beforeCreate: function (admin, next) {
    hashPassword(admin, next);
  },

  /**
   * Callback to be run before updating an Admin.
   *
   * @param {Object}   admin Values to be updated
   * @param {Function} next
   */
  beforeUpdate: function (admin, next) {
    hashPassword(admin, next);
  }

};
