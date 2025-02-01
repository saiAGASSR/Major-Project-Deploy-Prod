import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.cloud_name,
    cloud_key: process.env.cloud_key,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

export { cloudinary, storage };
