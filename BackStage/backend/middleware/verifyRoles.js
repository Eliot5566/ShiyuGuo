// verifyRoles 函式是一個高階函式，它接受一組允許的角色作爲參數，然後返回一個中間件函式。
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // 檢查請求對象 req 是否具有 roles 屬性。如果沒有，它會回傳401，表示未授權。
        if (!req?.roles) return res.sendStatus(401);

        // 檢查req.roles是否符合角色的授權
        const result = req.roles === allowedRoles[0];
        // 如果是false，則回傳401，表示未授權。
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles