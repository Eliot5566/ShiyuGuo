// 匯入白名單
const allowedOrigins = require('../config/allowedOrigins');

// 在「跨域前」處理跨域請求的授權
const credentials = (req, res, next) => {
    // 從header中提取了origin
    // origin 是一個表示請求來源的 URL，通常包含協議、主機和端口。
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        // 把header中的Access-Control-Allow-Credentials設定為true
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials