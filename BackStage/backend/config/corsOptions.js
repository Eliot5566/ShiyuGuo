// 匯入白名單
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    // origin用來檢查來源是否在白名單中
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // callback這個函式用於通知CORS是否應該允許這個來源
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // 當OPTION請求成功時， 回傳的HTTP Code為200
    optionsSuccessStatus: 200
}

module.exports = corsOptions;

// 預設參數
// {
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
// }