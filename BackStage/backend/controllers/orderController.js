const myDBconn = require('../config/db');

const handleAllOrder =  async (req, res) => {
    myDBconn.query('SELECT * FROM orders',
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

const handleOrderByID =  async (req, res) => {
    myDBconn.query('SELECT * FROM orders where user_id = ? ORDER BY created_at DESC;',[req.body.id],
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

module.exports = { handleAllOrder, handleOrderByID }