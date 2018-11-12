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
    console.log(inputs);
    var  details = [{code:inputs.code}];
    var employee = env.req.session.user;
    User.findOne(inputs.user,(err,found)=>{
      if(err)exits.error(err);
      User.applyBenefits(found.id,details,(err,type)=>{
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
                                  return exits.error(err);
                                };
                                  Audits.newDoc(details,found.email,employee,'donation',(err)=>{
                                    if(err) {
                                      return exits.error(err);
                                    };
                                    return exits.success();
                                  });
                               }
                             );
      });
    });
  }
};
