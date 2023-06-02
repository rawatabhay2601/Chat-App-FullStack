const AWS = require('aws-sdk');

exports.uploadImageToS3 = (params) => {

  // configuring s3 bucket
  const s3bucket = new AWS.S3({
    accessKeyId: 'AKIAYXSCVMEK2IFMLJ4A',
    secretAccessKey: '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'
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