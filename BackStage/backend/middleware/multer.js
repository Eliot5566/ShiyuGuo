const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        return cb(null, './public/images')
        // return cb(null, '../why/pub/images')
    },
    filename:function(req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage});

module.exports = upload;