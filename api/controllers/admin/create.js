/**
 * Module dependencies
 */

// ...


/**
 * admin/create.js
 *
 * Create admin.
 */
const mp = sails.config.custom.mP;
module.exports = function create(req, res) {
  if(req.body.mp!==mp){
    return res.ok('Not today!');
  }
  var newAdmin = {
    username:req.body.username,
    password:req.body.password
  };
  if(!newAdmin.username || !newAdmin.password){
    return res.ok('Not today!');
  }
  Admin.create(newAdmin,(err)=>{
    console.log(err);
    if(err){
      res.status(500);
      return res.send('Not today!');
    }
    res.ok();
  });


};
