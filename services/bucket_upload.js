const Cloud = require('@google-cloud/storage');
const { publicDecrypt } = require('crypto');
const path = require('path')
const serviceKey = path.join(__dirname, '../gcs-cred.json')

require('dotenv').config();

async function uploadImage(req_file){
    try{
        const { Storage } = Cloud
        const storage = new Storage({
            keyFilename: serviceKey,
            projectId: process.env.GOOGLE_CLOUD_PROJECT
        })
        console.log(process.env.GOOGLE_CLOUD_PROJECT);
        const bucket = storage.bucket(process.env.PLANT_IMG_BUCKET);
        const blob = bucket.file(req_file.originalname);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
 
        
        return new Promise((resolve, reject) => {
          blobStream.on('error', (err) => {
              console.error('Error uploading file:', err);
              reject(err);
          });

          blobStream.on('finish', () => {
              const publicURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
;
              resolve(publicURL);
          });

          blobStream.end(req_file.buffer);
      });

    }catch(error){
        console.log(error.message);
    }
    
}


module.exports = uploadImage 