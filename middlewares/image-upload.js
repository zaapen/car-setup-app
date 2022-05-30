const multer = require('multer');
const uuid = require('uuid').v4;

const upload = multer({
  storage: multer.diskStorage({
    destination: 'carSetupData/images',
    filename: (req, file, cb) => {
      cb(null, uuid() + '-' + file.originalname);
    }
  })
});

const configureMulterMiddleware = upload.single('image');  // image is the name from the form

module.exports = configureMulterMiddleware;