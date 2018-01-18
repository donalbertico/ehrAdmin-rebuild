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
  mP : process.env.MP,
  bill:{
    ruc: '1792569036001',
    razonSocial:'CONFORTDIL CIA.LTDA.',
    nombreComercial:'Ecuador House Rentals',
    ambiente: process.env.BILL_ENVIRONMENT||'1',
    dirMatriz:'Av. de los Shyris N35-34 y Avenida Portugal, Edificio Albartos Piso 4 oficina 402',
    dirEstablecimiento:'AV. DE LOS SHYRIS Y PORTUGAL',
    establecimiento: '001',
    recepUrl:process.env.BILL_RECEPTURL,
    autoUrl:process.env.BILL_AUTOURLS
  },
  aws : {
    bucket : process.env.AWS_BUCKET,
    key : process.env.AWS_KEY,
    secret : process.env.AWS_SECRET
  },
  mailgun:{
    api_key:process.env.MAILGUN_APIKEY,
    domain:process.env.MAILGUN_DOMAIN,
    test:process.env.MAILGUN_TEST? true : false,
    avoidSend:process.env.MAILGUN_AVOIDSEND?true:false
  },
  sriPassword : process.env.SRI_PASSWORD
};
