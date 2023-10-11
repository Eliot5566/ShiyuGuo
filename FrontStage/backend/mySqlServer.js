//使用此檔案開啟後端伺服器
// require('dotenv').config();
const dotenv = require('dotenv');
// const Swal = require('sweetalert2');

dotenv.config();
const express = require('express');

// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const mysqlProductRouter = require('./routes/mysqlProduct.js');
const mysqlUsersRouter = require('./routes/mysqlUsers.js');
const mysqlOrderRouter = require('./routes/orderRoute.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const swal = require('sweetalert');
//如何處理 跨域問題 這裡使用cors
// const cors = require('cors');

const nodemailer = require('nodemailer');
const emailValidator = require('email-validator');

const app = express();
app.use(cors());
//app.use(cors()) 這個中介軟體會讓 Express 伺服器在處理請求時，自動加上 CORS 標頭，讓瀏覽器知道這個伺服器允許跨域請求。
//所以加上後 會讓前端可以跨域請求後端的資料 這樣就不會出現錯誤訊息
//其他域名的網頁，要想請求這個伺服器的資源，就必須要加上 CORS 標頭，告訴瀏覽器這個伺服器允許跨域請求。
//舉例來說 如果前端網頁是 http://localhost:3000，而後端伺服器是 http://localhost:5000，那麼前端網頁就必須要加上 CORS 標頭，才能請求後端伺服器的資源。
//其他網域的範例
// Access-Control-Allow-Origin: http://localhost:3122
// Access-Control-Allow-Origin 要加在哪裡呢？它是一個 HTTP 標頭，所以要加在 HTTP 回應的標頭中。
//舉例來說，如果你使用 Express，可以使用 res.header() 方法加上這個標頭。// res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
app.use(bodyParser.json());

//訂閱
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//訂閱

// 設定伺服器監聽埠號
const port = process.env.PORT || 5000;

// 請根據你的 MySQL 連接設定進行修改
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'japan',
  port: process.env.DB_PORT || 8080,
});

db.connect(function (err) {
  if (err) {
    console.log('==========瓜瓜 資料庫有問題');
    console.log(err);
  } else {
    console.log('==========丁丁 資料庫ok');
  }
});

//創建一個 promise 版本的 query 函式
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

// 修改 executeQuery 函式，讓它可以執行多條 SQL 指令 (SQL 語法) 並回傳結果
async function executeQuery(sql, params) {
  try {
    const results = await queryAsync(sql, params);
    return results;
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    throw error;
  }
}

// 添加路由
app.get('/', (req, res) => {
  return res.json('資料庫測試中');
});

app.get('/products', async (req, res) => {
  const sql = 'SELECT * FROM products WHERE onSale = 1';
  try {
    const results = await executeQuery(sql);
    console.log('==========丁丁 SQL指令執行OK');
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:category', async (req, res) => {
  const category = req.params.category;
  const sql = 'SELECT * FROM products where category = ? and onSale = 1';

  try {
    const results = await executeQuery(sql, [category]);
    console.log('==========丁丁 SQL指令執行OK');
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/:_id', async (req, res) => {
  const _id = req.params._id;
  const sql = 'SELECT * FROM products where _id = ? and onSale = 1';

  try {
    const results = await executeQuery(sql, [_id]);
    console.log('==========丁丁 SQL指令執行OK');
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//
app.post('/save-card-info', (req, res) => {
  const { userId, cardType, cardContent, selectedProduct } = req.body;

  // 把卡片資訊 產品資訊存入資料庫
  const sql =
    'INSERT INTO cards (user_id, card_type, card_content, selected_product) VALUES (?, ?, ?, ?)';
  db.query(
    sql,
    [userId, cardType, cardContent, selectedProduct],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res
          .status(200)
          .json({ message: 'Card and product information saved successfully' });
      }
    }
  );
});

//
//訂閱功能
app.post('/subscribe', async (req, res) => {
  const email = req.body.email;
  console.log(email);
  // 驗證郵件地址格式
  if (!emailValidator.validate(email)) {
    res.status(400).send('無效的郵件地址');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
      pass: (process.env.MAIL_PASS = 'myza ffmq yyid xlpq'),
    },
  });

  const mailOptions = {
    from: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
    to: email,
    subject: '拾月菓-訂閱確認',
    html: `
    <![CDATA[
    ]]>
    <div className="container">
      <h1>拾月菓-訂閱確認</h1>
      <p>親愛的拾月菓（ShiyueGuo）的忠實顧客，</p>
      <p>感謝您訂閱拾月菓的最新消息！我們非常高興您加入我們的大家庭。</p>
      <p>您將第一個獲得以下好處：</p>
      <ul>
        <li>獨家折扣和促銷信息：您將獲得我們最新的促銷信息，包括折扣和特別優惠。</li>
        <li>新產品發布通知：無需等待，我們將直接通知您我們的新產品發布。</li>
        <li>活動邀請：不定期，我們會為我們的忠實顧客舉辦特別活動，您將被邀請參加。</li>
      </ul>
      <p>再次感謝您對拾月菓的支持。如果您有任何問題或建議，請隨時聯繫我們。</p>
      <p>祝您擁有美味的日式果子時光！</p>
      <p>拾月菓團隊</p>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('訂閱失敗');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send(
        // 使用swal彈出視窗 顯示訂閱成功

        '<script>alert("訂閱成功"); window.location.href = "/";</script>'
      );

      // 之後把網頁轉回首頁
    }
  });
});

//聯絡我們//

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // 使用 nodemailer 發送郵件
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
      pass: (process.env.MAIL_PASS = 'myza ffmq yyid xlpq'),
    },
  });

  const mailOptions = {
    from: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
    to: email,
    subject: '拾月菓-已收到您的來信',
    html: `
      <h1>親愛的拾月菓（ShiyueGuo）的忠實顧客 ${name} 您好，</h1>
      <p>感謝您發送訊息！我們已經收到您的來信。</p>
      <p>我們將盡快回覆您。</p>
      <p>拾月菓團隊</p>
      <p>您的訊息內容如下：</p>
      <p>訊息: ${message}</p>

      <p>如果您還有任何問題或建議，請隨時聯繫我們。</p>
      <p>祝您擁有美味的日式果子時光！</p>
      <p>拾月菓團隊</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('郵件發送失敗');
    } else {
      console.log('郵件已發送: ' + info.response);
      res.status(200).send('郵件已成功發送');
    }
  });
});

//聯絡我們

app.use(express.static('public'));
//訂閱功能

// 使用 express.json() 中介軟體來解析 JSON 格式的請求主體
app.use(express.json());
// 使用 express.urlencoded() 中介軟體來解析 URL 編碼的請求主體
app.use(express.urlencoded({ extended: true }));

//paypal金流
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/products', mysqlProductRouter);

app.use('/api/users', mysqlUsersRouter);

app.use('/api/orders', mysqlOrderRouter);

// app.use((err, req, res, next) => ))是一個錯誤處理器，用來捕捉所有的錯誤，並且將它們傳遞給下一個中介軟體。
//這裡 err 是錯誤物件，req 是請求物件，res 是回應物件，next 是下一個中介軟體函式。
//下一個中介軟體函式是一個函式，它的名稱通常是 next。它的作用是將控制權交給下一個中介軟體函式。
//如果沒有中介軟體函式處理錯誤，則錯誤會傳遞給 Express 內建的錯誤處理器。
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`後端伺服器MySQL 啟動於 http://localhost:${port}`);
});
