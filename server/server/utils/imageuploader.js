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
// exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
//   try {
//     const options = { folder };

//     if (height) options.height = height;
//     if (quality) options.quality = quality;

//     // auto optimization
//     options.resource_type = "auto";

//     const result = await Cloudinary.uploader.upload(file.tempFilePath, options);

//     return result;
//   } catch (err) {
//     console.log("Cloudinary Upload Error:", err);
//     throw err;
//   }
// };
// 