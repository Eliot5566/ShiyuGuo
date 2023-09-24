const myDBconn = require('../config/db');
const fs = require('fs');

const handleProducts = async (req, res) => {
    myDBconn.query('SELECT * FROM products',
    async function(err, data){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
        } else if (data.length == 0){
            return res.json(0);
        } else if (data.length > 0){
            res.json(data);
        }
    })
}

const handleEditProducts = async (req, res) => {
    const {_id, name, slug, category, price, countInStock} = req.body.editedProducts;
    myDBconn.query('UPDATE products SET name = ?, slug = ?,category = ?,price = ?,countInStock = ? WHERE _id = ?',
        [name, slug, category, price, countInStock, _id],
        async function(err, data){
            if(err){
                console.log("SQL指令執行錯誤=====");
                console.log(err);
                return res.sendStatus(400);
            } else {
                // 執行成功
                res.status(201).json({ 'success': `${name} 編輯產品成功` });
            }
        })

}

const handleOnSaleProducts = async (req, res) => {
    const {name, _id, onSale} = req.body.editedProducts;
    myDBconn.query('UPDATE products SET onSale = ? WHERE _id = ?',
        [onSale, _id],
        async function(err, data){
            if(err){
                console.log("SQL指令執行錯誤=====");
                console.log(err);
                return res.sendStatus(400);
            } else {
                // 執行成功
                res.status(201).json({ 'success': `${name} 上下架成功` });
            }
        })
}

const handleNewProducts = async (req, res) => {
    const {name, slug, category, price, countInStock, rating, description} = req.body;
    const image = req.files.image[0].path.replace(/\\/g, '/').replace('../../FrontStage/frontend/public/images/', '/images/');
    const gift_product = req.files.gift_product[0].path.replace(/\\/g, '/').replace('../../FrontStage/frontend/public/images/', '/images/');
    const product_package = req.files.product_package[0].path.replace(/\\/g, '/').replace('../../FrontStage/frontend/public/images/', '/images/');
    myDBconn.query('ALTER TABLE products AUTO_INCREMENT = 1'); // 讓ID從1開始
    myDBconn.query("insert into products (name, slug, category, image, price, countInStock, rating, description, gift_product, product_package) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [name, slug, category, image, price, countInStock, rating, description, gift_product, product_package],
    async function(err, data){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
        } else {
            // 執行成功
            res.status(201).json({ 'success': `新產品${slug}成功新增！` });
        }
    })
}

const handleDeleteProducts = async (req, res) => {
    // console.log(req.body.editedProducts);
    const {_id,name,image,gift_product,product_package} = req.body.editedProducts;
    myDBconn.query('DELETE FROM products where _id = ?',
    [_id],
    async function(err, data){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
            return res.sendStatus(400);
        } else {
            // 執行成功
            res.status(201).json({ 'success': `${name} 刪除成功` });
            fs.unlink(`../../FrontStage/frontend/public/${image}`, (err) => {
                if (err) {
                    console.error('刪除image時發生錯誤：', err);
                } else {
                    console.log('檔案已成功刪除');
                }
            });
            fs.unlink(`../../FrontStage/frontend/public/${gift_product}`, (err) => {
                if (err) {
                    console.error('刪除gift_product時發生錯誤：', err);
                } else {
                    console.log('檔案已成功刪除');
                }
            });
            fs.unlink(`../../FrontStage/frontend/public/${product_package}`, (err) => {
                if (err) {
                    console.error('刪除product_package時發生錯誤：', err);
                } else {
                    console.log('檔案已成功刪除');
                }
            });
        }
    })
}

module.exports = { 
    handleProducts,
    handleEditProducts,
    handleOnSaleProducts,
    handleNewProducts,
    handleDeleteProducts 
}