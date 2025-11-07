import cloudinary from "../lib/cloudinary.js";

/**
 * Uploads a base64 image to Cloudinary
 * @param {string} base64Image - Base64 image string
 * @param {string} folder - Folder in Cloudinary
 * @returns {Promise<string>} - URL of uploaded image
 */
export const saveBaseImage = async (base64Image, folder) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: "image",
    });
    return uploadResponse.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Failed to upload image");
  }
};
