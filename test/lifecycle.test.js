var Sails = require('sails');
var path= require('path');
var rc = require('rc');

  // Global before hook
  before(function (done) {
    this.timeout(145000);
    // Lift Sails with test database
    var sailsSettings = rc('sails');
    console.log(sailsSettings);


    Sails.lift({
      fixtures:require('./fixtures.js'),
      hooks:{
        grunt:false,
        fixtures:require('sails-hook-fixtures')
      }
    }, function(err) {
      if (err)
        return done(err);
      done();
    });
  });

  // Global after hook
  after(function (done) {
    console.log(); // Skip a line before displaying Sails lowering logs
    Sails.lower(done);
  });
