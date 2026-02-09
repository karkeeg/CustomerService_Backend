const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)) {
    cb(new Error("FILE FORMAT INCORRECT"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 2000000000,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
