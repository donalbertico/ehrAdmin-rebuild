module.exports = {


  friendlyName: 'Update',


  description: 'Update add.',


  inputs: {
    id:{type:'string',required:true},
    title:{type:'string'},
    description:{type:'string'},
    published:{type:'boolean'},
    location:{type:'json'}
  },


  exits: {
    error:{
      statusCode:500
    },
    success:{
      statusCode:200
    },
    conflict:{
      statusCode:409
    }
  },


  fn: function (inputs, exits) {

    let updates = Object.assign({},inputs);
    delete updates.id;
    Add.update(inputs.id,updates).meta({fetch:true}).exec((err,updated)=>{
      if(err)return exits.error(err);
      return exits.success(updated[0]);
    });

  }


};
