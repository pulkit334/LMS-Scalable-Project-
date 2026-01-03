const Cloudinary = require("../utils/cloudinaryupload");

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    // auto optimization
    options.resource_type = "auto";

    const result = await Cloudinary.uploader.upload(file.tempFilePath, options);

    return result;
  } catch (err) {
    console.log("Cloudinary Upload Error:", err);
    throw err;
  }
};
