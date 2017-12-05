module.exports = {
  models:{
    datastore:'testMongo',
    migrate: 'safe'
  },
  session:{
    secret:'f99fc5594661102ab5055dc74a2f2ebd',
    adapter:'connect-redis',
    url:'redis://127.0.0.1:6379/0'
  },
  datastores:{
    testMongo:{
      adapter:require('sails-mongo'),
      url:'mongodb://localhost:27017/ehr'
    }
  },
  port:9000,
  paths:{
    'public':'frontend'
  }
};
