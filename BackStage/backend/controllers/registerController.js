const bcrypt = require("bcryptjs");
const myDBconn = require('../config/db');

const handleNewName = async (req, res) => {
    // 解構賦值
    const { name, email, phone} = req.body;
    // 先確認有沒有相同的email
    myDBconn.query('select email from member where email = ?',[email],async function(err, results){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
            return res.status(500).json({ 'message': err.message });
        } else if (results.length > 0){
            // 有找到相同的name，代表已經有這個帳號了，拒絕註冊
            return res.sendStatus(409);
        } else {
            // 沒找到相同email，接受註冊
            // 將密碼加密
            req.body.pwd = await bcrypt.hash(req.body.pwd, 8); // 加密
            myDBconn.query('ALTER TABLE member AUTO_INCREMENT = 1'); // 讓ID從1開始
            myDBconn.query("insert into member (name, pwd, email, phone) values (?, ?, ?, ?)", 
                [name, req.body.pwd, email, phone],
                function (err, rows) {
                    if(err){
                        console.log("SQL指令執行錯誤=====");
                        console.log(err);
                    } else {
                        // 執行成功
                        res.status(201).json({ 'success': `新會員${name}註冊了，信箱是:${email}` });
                    }
                }
            )
        }
    });
}

module.exports = { handleNewName };