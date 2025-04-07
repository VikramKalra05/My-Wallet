const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-photos", // Cloudinary folder name
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, 
  },
});

const upload = multer({ storage }).single("photo");

module.exports = { cloudinary, upload };
