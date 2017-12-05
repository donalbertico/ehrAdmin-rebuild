/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */


var index;
module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
      'cookieParser',
      'session',
      'checkHeader',
      'bodyParser',
      'compress',
      'poweredBy',
      'router',
      'spa',
      'www',
      'favicon'
    ],


    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/
    checkHeader:function(req,res,next) {
      next();
    },
    spa:function(req,res,next){
      var path = sails.config.paths.public+'/index.html';
      if(sails.config.environment==='production'){
        if(!index){
          index= require('fs').readFileSync(path,'utf8');
        }
      }else{
        index= require('fs').readFileSync(path,'utf8');
      }

      //check if the request is for any asset file
      if(req.path.indexOf('.')>=0){
        return next();
      }
      res.set('Content-Type', 'text/html');
      return res.send(index);
    }

  },
  trustProxy:true
};
