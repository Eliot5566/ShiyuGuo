const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const verifyJWT = require('../middleware/verifyJWT');
const upload = require('../middleware/multer');


router.post('/',verifyJWT,productsController.handleProducts);

router.post('/new', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gift_product', maxCount: 1 },
    { name: 'product_package', maxCount: 1 }
]) ,productsController.handleNewProducts);

router.put('/', productsController.handleEditProducts);

router.put('/onSale', productsController.handleOnSaleProducts);

router.delete('/', productsController.handleDeleteProducts);


module.exports = router;