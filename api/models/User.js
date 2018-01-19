var url = require('url');
var detailDic = require('./details');
require('date-utils');
/**
*User Model
*
*/
/**
*
*User
*@typedef {Object} User
*@property {String} email
*@property {String} firstName
*@property {String} lastName
*@property {String} userType - Type for the user. Must be one of: n(Natural person) h(Hotel) b(Broker) e(Enterprise)
*@property {String[]} phones - User phones. Up to 3 per user.
*@property {Boolean} mailVerified - Determines if user has or hasn't verified his email address
*@property {Object} extraInfo - Extra info provided by the user
*@property {String} extraInfo.photo - Cloudinary's photo ID from the photo that the user uploaded.
*@property {String} extraInfo.id - National ID or passport number
*@property {Date} extraInfo.birthDate - User's birth date
*@property {Object} extraInfo.location - Object containing user location's details
*@property {String} extraInfo.location.address - Srteets and specifications where the user lives.
*@property {String} extraInfo.location.city - City where the user lives.
*@property {String} extraInfo.location.country - Country where the user lives.
*@property {Object} contactInfo - Optional contact info to replace defaults defined on the main object when needed
*@property {Boolean} contactInfo.used - Wether if this info should be used or not
*@property {String} contactInfo.email
*@property {String} contactInfo.firstName
*@property {String} contactInfo.lastName
*@property {String[]} contactInfo.phones
*@property {String[]} passports
*@property {String} enterprise
*/
var verificarCedula=function(cedula){
    if(cedula.length!=10){
      return false;
    }
    var sum= 0,coef=2;
    for (var i = 0; i < cedula.length-1; i++) {
      var res = cedula[i]*coef>=10 ? (cedula[i]*coef)-9 : (cedula[i]*coef);
      sum+=res;
      coef = coef===2 ? 1 : 2;
    };
    return (10-(sum%10))==cedula[9];
};
var verificarRuc=function(ruc){
    if(ruc.length!=13){
      return false;
    }
    if(ruc[2]==9){
      var sum= 0,coefs=[4,3,2,7,6,5,4,3,2];
      for (var i = 0; i < coefs.length; i++) {
        var res = coefs[i]*ruc[i];
        sum+=res;
      };
      return (11-(sum%11))==ruc[9];

    }else if(ruc[2]==6){
      var sum= 0,coefs=[3,2,7,6,5,4,3,2];
      for (var i = 0; i < coefs.length; i++) {
        var res = coefs[i]*ruc[i];
        sum+=res;
      };
      return (11-(sum%11))==ruc[8];

    }else if(ruc[2]<6){
      return verificarCedula(ruc.slice(0,-3)) &&(ruc[10]+ruc[11]+ruc[12])==1;
    }
};
module.exports = {
  attributes: {
    email:{type:'string',required:true,unique:true},
    firstName:{type:'string',allowNull:true},
    lastName:{type:'string',allowNull:true},
    userType:{type:'string',isIn:['n','h','b','e']},
    phones:{type:'json',defaultsTo:[]},
    mailVerified:{type:'boolean',defaultsTo:false},
    extraInfo:{
      type:'json',
      defaultsTo:{
        photo:null,
        id:null,
        birthDate:null,
        location:{
          address:null,
          city:null
        },
      }
    },
    contactInfo:{
      type:'json',
      defaultsTo:{
        used:false,
        firstName:null,
        lastName:null,
        email:null,
        phones:[]
      }
    },
    paymentInfo:{
      type:'json',
      defaultsTo:{},
      custom : (info)=>{
        if(info){
          if(info.idType==='05'){
            if(!info.name||!verificarCedula(info.identifier)){
              return false;
            }else{
              return true;
            }
          }else if(info.idType==='04'){
            if(!info.name||!verificarRuc(info.identifier)){
              return false;
            }else{
              return true;
            }
          }else if(info.idType==='06'){
            var identifier = new RegExp('^([A-Za-z0-9]){6,18}$');
            return identifier.test(info.identifier);
          }else if(info.idType==='07'){
            if(info.name!=='Consumidor Final'||info.identifier!=='9999999999999'){
              return false;
            }else{
              return true;
            }
          }
        }else{
          return false;
        }
      }
    },
    //relationships
    passports : { collection: 'Passport', via: 'user'},
    tokens : {collection:'Token',via:'user'},
    properties : { collection: 'Property', via: 'owner'},
    enterprise : {collection : 'enterprise', via: 'deputy'},
    payments : {collection : 'payments', via: 'payer'},
    collaborateWith : {model : 'enterprise'},

    //misc
    plusUntil : {type: 'json', defaultsTo:null},
    promoteTokens : {type: 'number', defaultsTo:0},
    mailChimpId: {type:'string',allowNull:true},
    qbId: {type:'string',unique:true},
    wantsNews: {type:'boolean',defaultsTo:false}

  },
  isPlus:function(user){
    return user.plusUntil==null ? false :  Date.compare(user.plusUntil, Date.today()) >= 0;
  },
  getContactInfo:function(user){
    var info={};
    if(user.contactInfo.used){
      info.firstName=user.contactInfo.firstName;
      info.lastName=user.contactInfo.lastName;
      info.phones=user.contactInfo.phones;
      info.email=user.contactInfo.email;
    }else{
      info.firstName=user.firstName;
      info.lastName=user.lastName;
      info.phones=user.phones;
      info.email=user.email;
    }
    if(user.extraInfo.photo){
      info.photo=user.extraInfo.photo;
    }else{
      info.photo=null;
    }
    return info;
  },
  qualifUser:function(user){
      var qual=0;
      if(user.mailVerified){
        qual+=2;
      }
      if(user.phones[0]){
        qual+=1;
      }
      if(user.extraInfo.photo){
        qual+=2;
      }
      if(user.extraInfo.id){
        qual+=2;
      }
      if(user.extraInfo.birthDate){
        qual+=1;
      }
      if(user.extraInfo.location.address){
        qual+=1;
      }
      if(user.extraInfo.location.city){
        qual+=1;
      }
      return qual;
  },
  canPublish:function(user){
    var result=false;
    if(!user.mailVerified){
      return false;
    }
    if(user.contactInfo.used){
      if(user.contactInfo.firstName&&
        user.contactInfo.lastName&&
        user.contactInfo.email&&
        user.contactInfo.phones[0]
      ){
        return true;
      }
    }else{
      if(user.firstName&&
         user.lastName&&
         user.phones[0]
       ){
        return true;
      }
    }
    return false;
  },
  afterCreate : (user, next)=>{
    if(!user.mailVerified){
      var params = {
        user:user.id,
        role: 'm',
        expireAt: (new Date()).add({days:1})
      };
      Token.createToken(params,(err,token,oldToken)=>{
        if(err){
          console.log(err);
          return next();
        }
        if(oldToken)return exits.conflict({message:'token_exists'});
        var encodedToken = encodeURIComponent(token);
        sails.hooks.mail.send(
                              'mailVerify',
                              {
                                recipientName: user.firstName,
                                uri: url.resolve('https://www.ecuadorhouserentals.com/verifyMail/',encodedToken),
                              },
                              {
                                to: user.email,
                                subject: 'Verificacion de Email'
                              },
                               function(err) {
                                if(err) {
                                  return next();
                                };
                                return next();
                               }
                             );
      });
    }else{
      return next();
    }
  },
  applyBenefits : (payer,details,cb)=>{
    var userBenefits = {};
    var type;
    User.findOne(payer,(err,found)=>{
      if(err) return cb(err);
      details.forEach((detail)=>{
        var benefits = detailDic.benefitsFromCode(detail.code);
        if (benefits.type == 'plan') {
          var newDate = userBenefits.plusUntil || found.plusUntil || new Date();
          newDate = new Date(newDate);
          newDate.add(benefits.add);
          userBenefits = {plusUntil : newDate};
        }else{
          var tokens = userBenefits.promoteTokens|| found.promoteTokens || 0;
          tokens += benefits.add.tokens;
          userBenefits = {promoteTokens : tokens};
        }
        type = benefits.type;
      });
      User.update(found.id,userBenefits,(err)=>{
        if(err) return cb(err);
        return cb(null,type);
      });
    });
  }
};
