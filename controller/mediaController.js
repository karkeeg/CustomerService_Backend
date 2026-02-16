const cloudinary = require('cloudinary').v2;

/**
 * Handle Single Image Upload
 */
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Cloudinary automatically handles the upload via multer-storage-cloudinary
    res.status(200).json({
      message: "Image uploaded successfully",
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

/**
 * Handle Multiple Images Upload
 */
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    res.status(200).json({
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    console.error("Multi-upload error (FULL):", error);
    console.error("Multi-upload error (JSON):", JSON.stringify(error, null, 2));
    res.status(500).json({ error: "Failed to upload images: " + (error.message || error) });
  }
};

/**
 * Delete Image from Cloudinary
 */
exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: "Public ID is required" });
    }

    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
