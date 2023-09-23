const myDBconn = require('../config/db');

const handleMember = async (req, res) => {
    myDBconn.query('SELECT * FROM users', 
    async function(err, data){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
        } else if (data.length == 0){
            return res.sendStatus(401);
        } else if (data.length > 0){
            res.json(data);
        }
    })
}

const handleEditMember = async (req, res) => {
    const {_id, name, roles} = req.body.editedMember;
    myDBconn.query('UPDATE users SET name = ?, roles = ? WHERE _id = ?',
        [name, roles, _id],
        async function(err, data){
            if(err){
                console.log("SQL指令執行錯誤=====");
                console.log(err);
                return res.sendStatus(400);
            } else {
                // 執行成功
                res.status(201).json({ 'success': `${name} 會員編輯成功` });
            }
        })
}

const handleDeleteMember = async (req, res) => {
    const {_id,name} = req.body.editedMember;
    myDBconn.query('DELETE FROM users where _id = ?',
    [_id],
    async function(err, data){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
            return res.sendStatus(400);
        } else {
            // 執行成功
            res.status(201).json({ 'success': `${name} 刪除成功` });
        }
    })
}

module.exports = { handleMember, handleEditMember, handleDeleteMember };




