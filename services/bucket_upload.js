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
        let imageURL;
        // bucket.upload(`../vbg_bangkit.jpg`,
        //     {
        //       destination: `user-plant-image/coba.jpg`,
        //     },
        //     function (err, file) {
        //       if (err) {
        //         console.error(`Error uploading image image_to_upload.jpeg: ${err}`);
        //       } else {
        //         console.log(`Image image_to_upload.jpeg uploaded to ${process.env.PLANT_IMG_BUCKET}.`);
        //         imageURL = `https://storage.googleapis.com/${bucket.name}/${destination}`
        //       }
        //     });
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
              const publicURL = format(
                  `https://storage.googleapis.com/${bucket.name}/${blob.name}`
              );
              resolve(publicURL);
          });

          blobStream.end(req_file.buffer);
      });

    }catch(error){
        console.log(error.message);
    }
    
}


module.exports = uploadImage 