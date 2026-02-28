import cloudinary from 'cloudinary';
import fs from 'fs';
 
// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: "dsmxulomo",
    api_key:"859651896622137",
    api_secret: "Sxpppde0NnZlyKhG_N_g9s_GzA0",
    secure: true,
});
 
 
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    console.log("Upload successful");
    return response.secure_url;
  } catch (error) {
    console.log("Error uploading to Cloudinary:", error.message);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

 
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary Delete Result:', result);
        return result; 
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Error deleting image from Cloudinary');
    }
};
 
export { uploadOnCloudinary, deleteFromCloudinary };