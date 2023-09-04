const path = require("path");
const funcs =  require("../common/functions/funcs");
const { Storage } = require('@google-cloud/storage');

exports.uploadFiles = (req,id,section) => {
    //console.log(req);
    const storage = new Storage({ keyFilename: appRoot+ '/src/key/keys.json' , projectId: 'winandwings-c05ab'});
    
    const bucket = storage.bucket('win_images') ;

    return new Promise(async(resolve, reject) => {

    if (!req.file || Object.keys(req.file).length === 0) {
      //return res.status(400).send('No files were uploaded.');
      reject('No files were uploaded.');
    }

    
    //console.log(req.file)
   
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   
      let sampleFile = req.file;
      console.log(sampleFile)
      const { originalname, buffer } = sampleFile
      let mime=sampleFile.mimetype;
      let size =sampleFile.size;
      let fname = originalname ;

      if(size>1*1024*1024){
          reject('file_size_too_big');
      }
      //console.log(sampleFile);
      var extname=path.extname(fname).toLowerCase();
      var ext = extname.replace('.',extname);
  
      if(extname==".jpg"|| extname==".jpeg"||extname==".png"||extname==".gif"){
       
          let fileName = section +"/"+id;
        
         
        try{
          const blob = bucket.file(fileName,{
          
          })
          const blobStream = blob.createWriteStream({
              resumable: false,
              contentType:mime,
              public: true,
          })
  
    blobStream.on('finish', () => {
      console.log(blobStream)
      const publicUrl = ('https://storage.googleapis.com/'+ bucket.name + '/' + blob.name)
      resolve(publicUrl)
    
    })
    .on('error', (err) => {
      console.log(err);
      reject(`Unable to upload image, something went wrong`)
    }).end(buffer)
          //console.log(saveFile);
         
        }catch(err){
            reject(err);
        }

          
  }else{
      reject("file_type_not_supported");
  }
  });
};


async function saveFileToGCS(storage,bucketName,localFilePath,remoteFileName) {
  try {
    // Reference to the Google Cloud Storage bucket
    const bucket = storage.bucket(bucketName);

    // Reference to the remote file
    const file = bucket.file(remoteFileName);

    // Upload the local file to Google Cloud Storage
    await bucket.upload(localFilePath, {
      destination: remoteFileName,
      gzip: true, // Optional: Enable gzip compression
    });

    console.log(`File ${localFilePath} uploaded to ${remoteFileName} in bucket ${bucketName}.`);
  } catch (error) {
    console.error('Error saving file to Google Cloud Storage:', error);
  }
}
