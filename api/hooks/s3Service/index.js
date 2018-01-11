var AWS = require('aws-sdk');
var aws_config = sails.config.custom.aws;
const comprobantesMap={'factura':aws_config.bucket};
AWS.config.update({accessKeyId:aws_config.key,secretAccessKey:aws_config.secret});
AWS.config.update({region:'sa-east-1'});
var s3= new AWS.S3();

module.exports = (sails) => {
  var uploadComprobante = (type,key,file,next)=>{
    var params={Bucket: comprobantesMap[type], Key: key, Body: new Buffer(file,'utf8')};
    s3.upload(params, (err, data)=>{
       if(err){
        return next(err,data);
       }
       return next(null,data);
    });
  }
  var getComprobante = (type,key,next)=>{
		s3.getObject({Bucket: comprobantesMap[type], Key: key+'.xml'},function(err,data){
			if(err)return next(err,null);
			return next(null,data);
		});
	}
	var deleteOne = (key,next)=>{
		s3.deleteObject({Bucket:'ehouserentals',Key:key},function(error,data){
						if(error) return next(error,null);
						return next(null,data);
		});
	}
	var deleteAll = (photos,next)=>{
		var forDelete=[];
		for (var i = photos.length - 1; i >= 0; i--) {
			forDelete.push({Key:photos[i]});
		};
		if(forDelete.length<1){
			return next(null,null);
		}
		var params = {
			Bucket:'ehouserentals',
			Delete: {
				Objects : forDelete
			}
		};
		s3.deleteObjects(params,(err,data)=>{
			if(err)return next(err,null);
			return next(null,data);
		});
	}
  return {
    upload : uploadComprobante,
    get : getComprobante
  };
};
