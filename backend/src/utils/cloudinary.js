import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" // filesystem by default in node js
 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//   clodanry v same database ki trah h to 

const uploadOnClodinary=async(localFilePath)=>{
try {
    // filepat is not there
    if(!localFilePath) return null;
    //  upload on cloudi from local file
        const response=await cloudinary.uploader.upload(localFilePath,{ 
            resource_type:"auto"
        });
        fs.unlinkSync(localFilePath)
        return response;


} catch (error) {
    // remove locally saved temp filles as the upload operation got failed
    fs.unlinkSync(localFilePath)
    return null;
}


}


export {uploadOnClodinary}