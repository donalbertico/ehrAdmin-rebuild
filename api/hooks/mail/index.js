module.exports = function(sails){
  var api_key = sails.config.custom.mailgun.api_key,
      domain = sails.config.custom.mailgun.domain,
      testMode= sails.config.custom.mailgun.test,
      avoidSend = sails.config.custom.mailgun.avoidSend,
      Mailgun = require('mailgun-js'),
      mailgun = new Mailgun({apiKey: api_key, domain: domain});
      /**
  *Sends an email using mailgun. There must be a configured view inside views/email with the name of the view that is going to
  *be used to compose the email.
  *@param {string} view - The name of the view that is going to be used
  *@param {Object} info - The info needed to compose some custom emails. See each view to find the exact parameters nedded.
  *@param {Object} destination - Cointains the destination address and subject
  *@param {string} destination.to - Address at which the email will be sent
  *@param {string} destination.subject - Subject of the email
  *@param {emailCallback} callback - The callback that handles the response
  */
  /**
  *
  *This callback function handles email sending response
  *
  *@callback emailCallback
  *@param {Object} error - Contains an error if something went wrong when sending the email. null when succeded
  *@param {Object} body - Contains the email body if everything went fine.
  */
  var send =function(view,info,destination,callback){
    info.layout='layout';
    view='email/'+view;
    //if avoidSend is active just bypass the sending process. This allows to keep the mailgun's send quota low
    if(avoidSend){
      console.log(`Mail sending avoided ${view} ${destination}`);
      callback(null);
    }else{
      //render the view with the given info
      sails.renderView(view,info,function(err,result){
        if(err)return callback(err);
        //construct the data object to be sent
        var data={
          from:`Ecuador House Rentals <customerservice@${domain}>`,
          to: destination.to,
          subject:destination.subject,
          html:result,
          'o:testmode':testMode
        };
        mailgun.messages().send(data, function (err, body) {
          if(err){
            console.log('Error sending email',err);
            return callback(null);
          }
          callback(null);
        });
      });
    }

  }

  return {
    send:send
  }

};
