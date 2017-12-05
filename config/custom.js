/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
*/

module.exports.custom = {
  /**************************************************************************
  *                                                                          *
  * Default settings for custom configuration used in your app.              *
  * (these may also be overridden in config/env/production.js)               *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunApiKey: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  appUrl : process.env.APP_URL,
  passport : {
    local: {
      strategy: require('passport-custom'),
      name : 'local',
      protocol: 'local'
    }
  },
  qb_config : {
    consumerKey:process.env.QB_CONSUMER_KEY,
    consumerSecret:process.env.QB_CONSUMER_SECRET,
    token:process.env.QB_TOKEN,
    secret:process.env.QB_SECRET,
    realmId:process.env.QB_REALMID,
    qbTest:true
  },
  mP : process.env.MP
};
