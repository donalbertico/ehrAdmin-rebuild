var request = require('supertest');
var chai = require('chai')
  , should = chai.should();
var user = request.agent('http://localhost:9000');
var cloudinary = require('cloudinary');
var path = require('path');
var fixtures = require('../../fixtures.js');

var addId;
describe('Add Controller',()=>{
  before((done)=>{
    //Log in the user before all tests
    user.post('/login')
        .send({username:'testuser',password:'password123'})
        .end((err,res)=>{
          if(err)return done(err);
          done();
        });
  });
  describe('Create',()=>{

    it('Should create a new Add and add default fields',(done)=>{
      user.post('/add/create')
          .send({
            title:'Nuevo Anuncio',
            description:'Anuncio sobre alfombras en el norte de Quito',
            url:'https://www.facebook.com',
            contactEmail:'test@test.com',
            type:'Tipo de prueba',
            place:'Quito',
            location:{
              latitude:0.3123,
              longitude:-72.12312
            }
          })
          .expect(200)
          .expect((res)=>{
            var add = res.body;
            add.title.should.equal('Nuevo Anuncio');
            add.published.should.equal(false);
            addId=add.id;
          })
          .end((err,res)=>{
            if(err) return done(err);
            done()
          });
    });

    it('Should not create a new add when there is bad parameters',(done)=>{
      user.post('/add/create')
          .send({
            description:'Anuncio sobre alfombras en el norte de Quito'
          })
          .expect(400)
          .end((err,res)=>{
            if(err) return done(err);
            done();
          });
    });

  });

  describe('Update',()=>{

    it('Should ignore photoPublicId if sent',(done)=>{
      user.post('/add/update')
          .send({
            id:addId,
            description:'Descripción actualizada',
            photoPublicId:'123123'
          })
          .expect(200)
          .expect((res)=>{
            let add = res.body;
            add.description.should.equal('Descripción actualizada');
            should.equal(add.photoPublicId, null);
          })
          .end((err,res)=>{
            if(err) return done(err);
            done()
          });
    });
    it('Should update an add normally',(done)=>{
      let updatedAdd={
        id:addId,
        title:'Titulo actualizado',
        type:'Nuevo tipo',
        description:'Descripción actualizada 2',
        contactEmail:'updated@contact.com',
        url:'newurl.com',
        published:true,
        place:'Nuevo Quito',
        location:{
          latitude:100,
          longitude:100
        }
      };
      user.post('/add/update')
          .send(updatedAdd)
          .expect(200)
          .expect((res)=>{
            let add = res.body;
            add.should.deep.equal({...updatedAdd,photoPublicId:null,createdAt:add.createdAt,updatedAt:add.updatedAt});
          })
          .end((err,res)=>{
            if(err) return done(err);
            done();
          });
    });

  });

  describe('Image Update',()=>{

    let publicId;

    before((done)=>{
      let cloudinaryConfig=sails.config.custom.cloudinary;
      cloudinary.config(cloudinaryConfig);
      let filePath = path.resolve(__dirname,'../../testImage.jpg')
      cloudinary.v2.uploader.upload(filePath,(err,result)=>{
        if(err)return done(err);
        publicId=result.public_id;
        done();
      });
    });

    after((done)=>{
      //Remove the uploaded image after upload is sent
      cloudinary.v2.uploader.destroy(publicId, (error, result)=>{
        if(error)return done(error);
        done();
      });
    });

    it('Should reject photoPublicId update when public Id is not real',(done)=>{
      user.post('/add/update-image')
          .send({
            id:addId,
            publicId:'123123'
          })
          .expect(409)
          .end((err,res)=>{
            if(err) return done(err);
            done();
          });
    });

    it('Should update photoPublicId',(done)=>{
      user.post('/add/update-image')
          .send({
            id:addId,
            publicId:publicId
          })
          .expect(200)
          .expect((res)=>{
            let add = res.body;
            add.photoPublicId.should.equal(publicId);
          })
          .end((err,res)=>{
            if(err) return done(err);
            done();
          });
    });

  });

  describe('Search',()=>{

    it('Should get all the adds',(done)=>{
      user.get('/add/search')
          .expect(200)
          .expect((res)=>{
            let adds = res.body;
            adds.length.should.equal(fixtures.Add.length+1);
          })
          .end((err,res)=>{
            if(err) return done(err);
            done()
          });
    });

  });

  describe('Delete',()=>{

    it('Should not delete when a wrong id is sent',(done)=>{
      user.post('/add/delete')
          .send({
            id:'123123'
          })
          .expect(409)
          .end((err,res)=>{
            if(err) return done(err);
            done()
          });
    });

    it('Should delete the',(done)=>{
      user.post('/add/delete')
          .send({
            id:addId
          })
          .expect(200)
          .end((err,res)=>{
            if(err) return done(err);
            done()
          });
    });

  });



});
