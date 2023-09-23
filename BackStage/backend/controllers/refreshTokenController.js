const jwt = require('jsonwebtoken');
const myDBconn = require('../config/db');
const dotenv = require("dotenv");
dotenv.config({ path:"../.env" });

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    // 如果在 Cookie 中找不到 jwt(也就是refreshToken)，則返回 401 狀態碼，表示未經授權。
    if (!cookies?.jwt){
        return res.sendStatus(401);
    } 
    // 如果找到了refreshToken，接著在資料庫中尋找具有相同refreshToken的用戶。
    const refreshToken = cookies.jwt;
    myDBconn.query('SELECT email,refreshtoken,roles FROM member WHERE refreshToken = ?', 
            [refreshToken],async function(err, data){
                if(err){
                    console.log("SQL指令執行錯誤=====");
                    console.log(err);
                } else if(data.length == 0){
                    // 如果找不到對應的用戶，則返回 403 狀態碼，表示禁止訪問（Forbidden）
                    return res.sendStatus(403);
                } else if(data.length > 0){
                    // 如果找到了用戶，接著使用 jwt.verify 函式來驗證refreshToken的有效性。
                    // 利用 jwt.verify() 解密驗證後會 callback 一個錯誤 err 與 payload
                    await jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET, // 也可以寫成data[0].refreshToken
                        (err, decoded) => {
                            const roles = data[0].roles;
                            // 如果錯誤，或是解密出的email與資料庫中的email不相符，則返回403狀態碼
                            if (err || data[0].email !== decoded.email){
                                // console.log("比對錯誤");
                                return res.sendStatus(403);
                            } 
                            // 如果refreshToken驗證成功，並且解密出的email與資料庫中的email相符，
                            // 則會生成一個新的accessToken，並將其返回給用戶端。
                            const accessToken = jwt.sign(
                                { "email": decoded.email,"roles":roles },
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: '10s' }
                            );
                            // 將生成的 accessToken 回傳給用戶端
                            res.json({ roles, accessToken })
                        }
                    );
                }
            }
        )
}
    
module.exports = { handleRefreshToken }