module.exports = {

  friendlyName: 'give a user benefits',

  description: 'give befits to a user from the product code on input',

  inputs: {
    user : {
      description : 'user id to promote',
      type : 'string',
      required : true
    },
    code : {
      description : 'product code',
      type : 'string',
      required : true
    }
  },

  fn: function (inputs, exits,env) {
    var  details = [{code:inputs.code}];
    User.findOne(inputs.user,(err,found)=>{
      if(err)exits.error(err);
      console.log(details);
      User.applyBenefits(found.id,details,(err,type)=>{
        console.log(err);
        if(err) exits.error(err);
        sails.hooks.mail.send(
                              'bonusBenefits',
                              {
                                type: type,
                                recipientName : found.firstName
                              },
                              {
                                to: found.email,
                                subject: 'Regalo de Ecuador House Rentals',
                              },
                               function(err) {
                                if(err) {
                                  console.log(err);
                                  return exits.error(err);
                                };
                                  return exits.success(err);
                               }
                             );
      });
    });
  }
};
