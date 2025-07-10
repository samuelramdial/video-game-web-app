const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, './public/images');
    }, 
    filename: function (req, file, cb)
    {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) =>
{
    const mimeTypes = ['image/jpeg', 'image/png'];
    if (mimeTypes.includes(file.mimetype))
    {
        return cb(null, true);
    }
    else
    {
        cb(new Error('Invalid file type. Only jpg, jpeg, and png files are allowed.'), false);
    }
}

exports.upload = multer({storage, 
                         fileFilter, 
                         limits: {fileSize: 
                         2 * 1024 * 1024}
                         }).single('image');
