const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        if (file.fieldname === "image") {
            return cb(null, '../../FrontStage/frontend/public/images')
        } else if (file.fieldname === "gift_product") {
            return cb(null, '../../FrontStage/frontend/public/product_gift_pic')
        } else if (file.fieldname === "product_package") {
            return cb(null, '../../FrontStage/frontend/public/product_gift_pic')
        } else {
            return cb(new Error('無效的文件字段'));
        }
        
    },
    filename:function(req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage});

module.exports = upload;