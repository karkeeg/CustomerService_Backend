require('dotenv').config({ path: './.env' }); // Adjust path if needed, or just run from backend root
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary Connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '******' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Not Set');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a simple text file buffer to upload
const buffer = Buffer.from('Cloudinary Test Upload ' + new Date());

new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: 'test_upload_' + Date.now() },
        (error, result) => {
            if (error) {
                console.error('❌ Cloudinary Upload Failed:', error);
                reject(error);
            } else {
                console.log('✅ Cloudinary Upload Success!');
                console.log('URL:', result.secure_url);
                resolve(result);
            }
        }
    );
    uploadStream.end(buffer);
}).catch(err => {
    // Process exit with error
     process.exit(1);
});
