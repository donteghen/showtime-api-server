const cloudinary = require("cloudinary").v2;
const {cloudinaryName, cloudinarySecret, cloudinaryKey} = require('../config/env')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || cloudinaryName,
  api_key: process.env.API_KEY || cloudinaryKey,
  api_secret: process.env.API_SECRET || cloudinarySecret,
}); 
module.exports = cloudinary;