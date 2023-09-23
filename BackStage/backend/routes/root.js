const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    // 使用正則表達式來匹配路徑，這個表達式 ^/$|/index(.html)? 
    // 用於匹配根路徑（'/'）和'/index.html'，
    // 以及帶有可選的'.html'擴展名的路徑。這意味著它可以處理多個路徑變體
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;