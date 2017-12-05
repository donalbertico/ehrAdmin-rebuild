var bcrypt = require('bcryptjs');

/**
 * Hash a passport password.
 *
 * @param {Object}   password
 * @param {Function} next
 */
function hashPassword (passport, next) {
  if (passport.password) {
    bcrypt.hash(passport.password, 10, function (err, hash) {
      passport.password = hash;
      next(err, passport);
    });
  } else {
    next(null, passport);
  }
}

/**
 * Passport Model
 *
 * The Passport model handles associating authenticators with users. An authen-
 * ticator can be either local (password) or third-party (provider). A single
 * user can have multiple passports, allowing them to connect and use several
 * third-party strategies in optional conjunction with a password.
 *
 * Since an application will only need to authenticate a user once per session,
 * it makes sense to encapsulate the data specific to the authentication process
 * in a model of its own. This allows us to keep the session itself as light-
 * weight as possible as the application only needs to serialize and deserialize
 * the user, but not the authentication data, to and from the session.
 */
var Passport = {
  attributes: {
    protocol: { type: 'string', required: true },

    password    : { type: 'string', minLength: 3 },
    accessToken : { type: 'string' },

    provider   : { type: 'string' },
    identifier : { type: 'string' },

    user: { model: 'User', required: true },
  },

  /**
   * Validate password used by the local strategy.
   *
   * @param {string}   password The password to validate
   * @param {Function} next
   */
  validatePassword: function (query,password,callback) {
    this.findOne(query,(err,found)=>{
      if(err) return callback(err);
      if(found){
        bcrypt.compare(password, found.password,(err,res)=>{
          return callback(null,res,found);
        });
      }else{
        callback({message:'email_or_pass_invalid'})
      }
    });
  },

  /**
   * Callback to be run before creating a Passport.
   *
   * @param {Object}   passport The soon-to-be-created Passport
   * @param {Function} next
   */
  beforeCreate: function (passport, next) {
    hashPassword(passport, next);
  },

  /**
   * Callback to be run before updating a Passport.
   *
   * @param {Object}   passport Values to be updated
   * @param {Function} next
   */
  beforeUpdate: function (passport, next) {
    hashPassword(passport, next);
  }
};

module.exports = Passport;
