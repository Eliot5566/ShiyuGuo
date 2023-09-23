// ???
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const myDBconn = require('../config/db');
const dotenv = require("dotenv");
dotenv.config({ path:"../.env" });


const handleForgetPWD = async (req, res) => {
    // 解構賦值
    const {email} = req.body;
    // 先驗證帳號
    myDBconn.query('SELECT name,pwd,email FROM member WHERE email = ?', 
    [email],
    async function (err, data){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
        } else if(data.length == 0) {
            // 沒有找到帳號
            return res.sendStatus(400);
        } else if(data.length > 0){
            // 有找到帳號
            // 產生resetPWDToken
            const resetPWDToken = jwt.sign(
                { "email": email },
                process.env.RESET_TOKEN_SECRET,
                { expiresIn: '15min' }
            );
            // 下面為nodemailer參數
            // 要傳送郵件的帳號密碼(店家的信箱)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                }
            });
            
            var mailOptions = {
                from: 'hank57054@gmail.com', // 從誰發出郵件
                to: email,  // 要發給誰
                subject: '重置密碼', // 電子郵件的標題
                text: `http://localhost:3000/resetPWD/${email}/${resetPWDToken}` // 發送的內容
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log("Email發送失敗");
                    console.log(error);
                    return res.sendStatus(401);
                } else {
                    return res.json({
                        status:"驗證信傳送成功！"
                    });
                }
            });
        }
    })
}

module.exports = { handleForgetPWD };