const myDBconn = require('../config/db');

const getAllEmail = async (req, res) => {
    // 找全部用戶
    myDBconn.query('select id,name,email,phone,roles from member',async function(err, results){
        if(err){
            console.log("SQL指令執行錯誤=====");
            console.log(err);
            return res.status(204).json({ 'message': 'No email found' });
        } else if (results.length == 0){
            // 如果沒找到用戶，回傳204
            return res.status(204).json({ 'message': 'No email found' });
        } else if (results.length > 0){
            // 把全部用戶回傳
            res.json(results);
        }
    })
}

// 未實現的功能
const getEmail = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'email ID required' });
    const email = await email.findOne({ _id: req.params.id }).exec();
    if (!email) {
        return res.status(204).json({ 'message': `email ID ${req.params.id} not found` });
    }
    res.json(email);
}

const deleteEmail = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'email ID required' });
    const email = await email.findOne({ _id: req.body.id }).exec();
    if (!email) {
        return res.status(204).json({ 'message': `email ID ${req.body.id} not found` });
    }
    const result = await email.deleteOne({ _id: req.body.id });
    res.json(result);
}



module.exports = {
    getAllEmail,
    deleteEmail,
    getEmail
}