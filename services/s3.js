const AWS = require('aws-sdk');
require('dotenv').config();

exports.uploadImageToS3 = (params) => {

  // configuring s3 bucket
  const s3bucket = new AWS.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESKEY
  });

  // Upload the image to S3
  return new Promise( (resolve,reject) => {
    s3bucket.upload(params, (err, data) => {
      
      if(err) {
        reject('Error uploading image to S3:', err);
      }
      else {
        resolve(data.Location);
      }
    })
  })
  
};