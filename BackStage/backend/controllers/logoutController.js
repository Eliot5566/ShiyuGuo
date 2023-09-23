const myDBconn = require('../config/db');

const handleLogout = async (req, res) => {
    // 在客戶端要移除accessToken及refreshToken，且在資料庫刪除refreshToken
    // 如果在Cookie中找不到jwt(也就是refreshToken)，則返回 204 狀態碼，表示無內容。
    const cookies = req.cookies;
    if (!cookies?.jwt){
        return res.sendStatus(204);
    } 
    const refreshToken = cookies.jwt;
    // 如果找到了refreshToken，在資料庫中尋找具有相同refreshToken的email。
    myDBconn.query('SELECT email,refreshtoken FROM member WHERE refreshToken = ?', 
            [refreshToken],function(err, data){
                if(err){
                    console.log("SQL指令執行錯誤=====");
                    console.log(err);
                } else if(data.length == 0){
                    // 如果找不到對應的email，表示refreshToken在資料庫中不存在，
                    // 清除名為jwt的Cookie(也就是refreshToken)，然後返回 204 狀態碼，表示無內容。
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.sendStatus(204);
                } else if(data.length > 0){
                    // 如果找到對應的用戶，表示refreshToken在資料庫中存在
                    // 將refreshToken從資料庫中移除(設置為空字串)
                    // 清除名為jwt的Cookie(也就是refreshToken)，然後返回 204 狀態碼，表示無內容。
                    myDBconn.query("UPDATE member SET refreshToken = '' WHERE email = ?",[data[0].email])
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    res.sendStatus(204);
                }
            })
}

module.exports = { handleLogout }
