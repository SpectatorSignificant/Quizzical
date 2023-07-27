const S3 = require("aws-sdk/clients/s3");
const dotenv = require("dotenv");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");

const upload = multer({dest: "uploads/"});

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({region, accessKeyId, secretAccessKey});

function uploadFile(file){
    try{
        const fileStream = fs.createReadStream(file.path);
    
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.filename
        }
    
        return s3.upload(uploadParams).promise();
    }
    catch (e){
        console.log("Error uploading file to S3:", e.message);
    }
}

function getFileStream(fileKey){
    try{
        const downloadParams = {
            Key: fileKey,
            Bucket: bucketName
        }
    
        return s3.getObject(downloadParams).createReadStream();
    }
    catch (e){
        console.log("Error getting file from S3:", e.message);
    }
}
function deleteFile(fileKey){ //this is not a promise, remember
    try{
        const deleteParams = {
            Key: fileKey,
            Bucket: bucketName
        }

        s3.deleteObject(deleteParams, (err, data) => {
            console.log(data);           
        });
    }
    catch (e){
        console.log("Error deleting file from S3:", e.message);
    }
}

module.exports = { upload, uploadFile, getFileStream, unlinkFile, deleteFile}