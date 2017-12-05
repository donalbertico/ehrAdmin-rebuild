module.exports = {


  friendlyName: 'Logout',


  description: 'Logout admin.',


  inputs: {
  },


  exits: {

  },


  fn: function (inputs, exits,env) {
    env.res.clearCookie('authenticated');
    // mark the user as logged out for auth purposes
    env.req.session.authenticated = false;
    env.res.redirect('/');

  }


};
