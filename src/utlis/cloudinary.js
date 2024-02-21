import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// cloudinary.config({
//     cloud_name: toString(process.env.CLOUDINARY_CLOUD_NAME),
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: toString(process.env.CLOUDINARY_API_SECRET)
// });

cloudinary.config({
    cloud_name: 'dnzylxcf5',
    api_key: '817981547841538',
    api_secret: 'yClz4h2SFXeCR7GaMqYCoYabaZw'
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log(process.env.CLOUDINARY_API_KEY)
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log("Error is ", error)
        return null;
    }
}



export { uploadOnCloudinary }