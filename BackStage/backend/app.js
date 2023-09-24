const dotenv = require("dotenv");
dotenv.config({ path:"./.env" });
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT;

//////資料庫//////
const myDBconn = require('./config/db');
myDBconn.connect(function(err){
    if(err){
        console.log("=======資料庫有問題=======");
        console.log(err);
    }else{
        console.log("=======已連接到資料庫=======");
    }
});

// 在「跨域前」處理跨域請求的授權
app.use( credentials );
// 處理跨域
app.use( cors(corsOptions) );
// 處理URL編碼表單數據
// extended 設定為 false，表示解析的表單數據將使用Node.js內建的querystring模組解析，
// 而不是使用第三方的模組。
app.use( express.urlencoded( {extended: true}) );
// 當客戶端向服務器發送包含JSON數據的POST或PUT請求時，這個middleware將幫助解析該JSON數據
app.use( express.json() );
// 當客戶端向服務器發送請求時，其中包含了存儲在Cookie中的數據，
// 這個中間件將協助解析這些Cookie數據，使其可供你的路由處理程序訪問
app.use( cookieParser() );
// 靜態檔案
app.use('/', express.static("../../FrontStage/frontend/public/"));

// 路由
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/changePWD', require('./routes/changePWD'));
app.use('/forgetPWD', require('./routes/forgetPWD'));
app.use('/resetPWD', require('./routes/resetPWD'));
app.use('/logout', require('./routes/logout'));

app.use('/member', require('./routes/member'));
app.use('/products', require('./routes/products'));
app.use('/order', require('./routes/order'));


app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));
// 未實現功能的路由
// app.use('/employees', require('./routes/api/employees'));

// 這個路由處理程序是一個通用的錯誤處理程序，它用於處理所有未匹配到其他路由的請求，
// 並根據客戶端的接受能力（Accept header）返回對應的錯誤響應
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.listen(PORT, function () {
    console.log('原神！啟動！時間：' + new Date().toLocaleTimeString())
});
