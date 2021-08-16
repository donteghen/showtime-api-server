const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({}),
    limits:{
        fileSize:2000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpeg|jpg)$/i)){
           return cb(new Error('file must be png, jpg or jpeg'));
        }
        cb(undefined, true);
        
    }
});
module.exports = upload