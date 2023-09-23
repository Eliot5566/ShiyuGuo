// 未實現的功能
// 匯入日誌記錄的功能
const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    // 將err.name和err.message以特定格式記錄下來，並寫入errLog.txt這個日誌文件中。
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    // 將stack trace印出來
    console.error(err.stack);
    // 設置HTTP code設定為500，表示內部伺服器錯誤，
    // 並將err.message作為響應內容返回給客戶端。
    res.status(500).send(err.message);
}

module.exports = errorHandler;

//Stack Trace是在程式運行中發生錯誤時的一種錯誤訊息輸出，
//它提供了一個關於錯誤的詳細追蹤資訊，包括錯誤發生的位置(Error Location)和程式的Call Stack。