const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const myDBconn = require('../config/db');
const dotenv = require("dotenv");
dotenv.config({ path:"../.env" });

const handleResetPWD = (req, res) => {
    // 解構賦值
    const { email, resetPWDToken } = req.body;
    // 先驗證resetPWDToken有沒有一樣
    jwt.verify(
        resetPWDToken,
        process.env.RESET_TOKEN_SECRET,
        async (err, decoded) => {
            if (err){
                // 如果token比對失敗，則返回403狀態碼
                return res.sendStatus(403);
            } else {
                //如果正確，進資料庫改密碼
                req.body.pwd = await bcrypt.hash(req.body.pwd, 8); // 將密碼加密
                myDBconn.query("UPDATE member SET pwd = ? WHERE email = ?"
                ,[req.body.pwd, email]
                , function(err, data){
                    if(err){
                        console.log("SQL指令執行錯誤=====");
                        console.log(err);
                    } else {
                        // 執行成功
                        res.status(201).json({ 'success': `${email} 密碼重置成功!` });
                    }
                });
            }
            
        }
    );
}
    
module.exports = { handleResetPWD }
