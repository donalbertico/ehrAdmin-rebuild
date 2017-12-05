
/**
 * Hash a token .
 *
 * @param {Object}   token
 * @param {Function} next
 */
function hashToken (token, next) {
    bcrypt.hash(token.token, 10, function (err, hash) {
      token.token = hash;
      next(err, token);
    });
}

/**
 * Token.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema:true,
  attributes: {
    token:{type:'string'},
		expireAt:{type:'json',required:true},
		user:{model:'User',required:true},
		role:{type:'string',required:true,isIn:['p','m']},
		//p:password reset
		//m:mail verification
  },
  /**
  *Takes a token and validates if the hashes are the same
  *
  */
  validateToken: function (original,toValidate, next) {
    bcrypt.compare(original, toValidate, next);
  },
  /**
	*Gets a token, looks it up on the database and if destroys it when found
	*
	*@param {string} token - The token to be consumed
	*@param {ConsumeTokenCallback} = Function called after
	*/

	/**
	*This callback is called after a consumeToken function has finalized
	*
	*@callback {CosumeTokenCallback}
	*@param {Object} err - Contains any error when destroying the token
	*@param {string} owner - Id of the token's owner. Null when the token is not valid
	*/
	consumeToken:function(token,next){
		var id=token.split(':')[0];
		var data=token.split(':')[1];
		Token.findOne(id).exec(function(err,foundToken){
			if(err) return next(err);
			if(!foundToken) return next(null,null);
			Token.validateToken(data,foundToken.token,function(err,success){
				if(err) return next(err);
				if(success){
					Token.destroy(id,function(err,destroyed){
						if(err) return next(err);
						return next(null,foundToken.user);
					});
				}else{
					return next(null,null);
				}
			});
		});
	},
  /**
  *Creates a token for a given user to expire on a set date and with a setted role. Returns three
  *parameters on the callback. The first one is default node style error, second is the created token(in case there
  *was one created) and the third one is a boolean stating if there was already a token issued
  *for that purpose and user.
  *
  *@param {Object} params - Object containing the new Token info
  *@param {!String} params.user - Id of the user that will own the token
  *@param {!Date} params.expireAt - Date object for when the token is going to expire
  *@param {!String} params.role - Role for the token. May be p(password recovery) or m(email verification)
  *@param {Function} next - The node style next function to be executed at the end
  */
	createToken:function(params,next){
    Token.findOne({user:params.user,role:params.role},(err,oldToken)=>{
      if(err)return next(err);
      //falls here if there is another token waiting to be consumed
      if(oldToken) return next(null,null,true);
      var random=shortid.generate();
  		params.token=random;
  		Token.create(params).meta({fetch:true}).exec(function(err,token){
  			if(err)return next(err);
  			var result=token.id+':'+random;
  			return next(null,result);
  		});
    });
	},
	/**
	 * Callback to be run before creating a Passport.
	 *
	 * @param {Object}   token The soon-to-be-created Passport
	 * @param {Function} next
	*/
	beforeCreate: function (token, next) {
	  hashToken(token, next);
	},

  	/**
  	 * Callback to be run before updating a Passport.
  	 *
   	 * @param {Object}   token Values to be updated
   	 * @param {Function} next
   	 */
	beforeUpdate: function (token, next) {
	   hashToken(token, next);
	}

};
