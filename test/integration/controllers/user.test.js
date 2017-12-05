var request = require('supertest');
var chai = require('chai')
  , should = chai.should();
var user = request.agent('http://localhost:9000');

describe('User Controller',()=>{
  before((done)=>{
    console.log('testing the tests;');
    done();
  });
  describe('test',()=>{
    it('should users from the fixtures',(done)=>{
      user.get('/test')
          .expect(200)
          .expect((res)=>{
            console.log(res.body);
          })
          .end((err,res)=>{
            if(err) return done(err);
            done()
          });
    });

  });
});
