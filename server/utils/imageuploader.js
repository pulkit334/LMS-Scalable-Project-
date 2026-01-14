const Cloudinary = require("../utils/cloudinaryupload");


exports.uploadImageToCloudinary = async (file, folder, options = {}) => {
  try {
    const uploadOptions = {
      folder,
      resource_type: "auto",

      ...(options.public_id && { public_id: options.public_id }),
      ...(options.overwrite && { overwrite: options.overwrite }),
      ...(options.invalidate && { invalidate: options.invalidate }),
      ...(options.height && { height: options.height }),
      ...(options.quality && { quality: options.quality }),
    };

    const result = await Cloudinary.uploader.upload(
      file.tempFilePath,
      uploadOptions
    );

    return result;
  } catch (err) {
    console.log("Cloudinary Upload Error:", err);
    throw err;
  }
};