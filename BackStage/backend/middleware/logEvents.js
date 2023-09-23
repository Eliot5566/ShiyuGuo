// 未實現的功能
// date-fns是一個用於日期和時間格式化的模組，它的format函數用來格式化日期和時間。
const { format } = require('date-fns');
// uuid是一個用於生成唯一標識符（UUID）的模組，這裡使用了 v4 函數來生成UUID。
const { v4: uuid } = require('uuid');

// fs和fs.promises為用於文件系統操作的模組
// fs.promises 提供了Promise的版本，用於異步操作。
const fs = require('fs');
const fsPromises = require('fs').promises;
// path為用於處理文件路徑的模組
const path = require('path');

// 實現HTTP請求日誌記錄功能，且將請求的詳細信息寫入日誌文件中
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try {
        // fs.existsSync 函數用於檢查指定路徑的文件或文件夾是否存在。
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            // 如果文件夾不存在，那麼應該在指定的路徑創建它
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        // 使用 fsPromises.appendFile 將 logItem 寫入指定的日誌文件
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    //將method、headers.origin及url記錄下來。
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`方法:${req.method},路徑:${req.path}`);
    next();
}

module.exports = { logger, logEvents };
