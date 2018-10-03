module.exports= {
  order: [ 'Admin','Add'],
  Admin:[
    {"username":"testuser","password":"password123"}
  ],
  Add:[
    {
      title:'Anuncio 1',
      description:'Descripción para el anuncio 1',
      contactEmail:'test@test.com',
      type:'Tipo de prueba',
      url:'https://www.facebook.com',
      photoPublicId:null,
      place:'Quito',
      location:{
        latitude:0.123123,
        longitude:0.123123
      }
    }
  ]
};
