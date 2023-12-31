//目前資料庫格視為 資料表users
//name   email   password   isAdmin(0,1)   age   _id (主鍵)
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const userRouter = express.Router();
const { isAuth, generateToken } = require('../utils.js'); // 請確保 utils.js 的路徑正確
const nodemailer = require('nodemailer');
const emailValidator = require('email-validator');

////如何處理cors 跨域問題
// const cors = require('cors');
// const corsOptions = {
//   origin: 'http://localhost:3000',
// headers是設置後端的伺服器允許接受來自於哪個頭部的請求
// credentials是設置後端的伺服器允許接受來自於哪個端口的請求
//   credentials: true,
//optionsSuccessStatus是設置後端的伺服器允許接受來自於哪個狀態的請求
//   optionSuccessStatus: 200,
// };
// userRouter.use(cors(corsOptions));

// 請根據你的 MySQL 連接設定進行修改
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'japan',
  port: process.env.DB_PORT || 8080,
});

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const { email, pwd } = req.body;
    console.log(req.body);

    try {
      const connection = await db.getConnection();
      const [users] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      connection.release();
      console.log(users);
      console.log(req.body);

      if (users.length > 0) {
        const user = users[0];

        if (bcrypt.compareSync(pwd, user.pwd)) {
          const token = generateToken(user); // 生成 token
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            token: token, // 將 token 發送給前端
          });
          return;
        }
      }

      res.status(401).send({ message: 'Invalid email or password' });
    } catch (error) {
      console.error(error);
      console.log(req.body);

      res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);

//   '/profile',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const { name, email, pwd } = req.body;
//     console.log(req.body);

//     try {
//       const connection = await db.getConnection();

//       // 確認重複信箱
//       const [existingUsers] = await connection.query(
//         'SELECT * FROM users WHERE email = ?',
//         [email]
//       );

//       if (existingUsers.length > 0) {
//         res.status(400).send({ message: 'Email address already registered' });
//         return;
//       }

//       // 使用 bcrypt 加密密碼
//       const hashedPassword = await bcrypt.hash(pwd, 8);

//       // 將新帳號資料 傳到資料庫
//       const [results] = await connection.query(
//         'UPDATE users (name, email, pwd) VALUES (?, ?, ?)',
//         [name, email, hashedPassword]
//       );

//       connection.release();

//       // 從資料庫撈出剛剛新增的帳號資料
//       const [newUser] = await connection.query(
//         'SELECT * FROM users WHERE _id = ?',
//         // 這裡的 results.insertId 是剛剛新增的帳號的 ID
//         //insertId 是資料庫自動生成的 ID 代表剛剛生成的帳號的 ID
//         [results.insertId]
//       );

//       const token = generateToken(newUser[0]); // 生成 token 並反饋給前端
//       res.send({
//         _id: newUser[0].id,
//         name: newUser[0].name,
//         email: newUser[0].email,
//         roles: newUser[0].roles,
//         token: token,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: 'Internal Server Error' });
//     }
//   })
// );

// 更新使用者資料
// userRouter.put(
//   '/profile',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const { name, email, pwd } = req.body;
//     console.log(req.body);

//     try {
//       const connection = await db.getConnection();

//       // 確認重複信箱
//       const [existingUsers] = await connection.query(
//         'SELECT * FROM users WHERE email = ?',
//         [email]
//       );

//       if (existingUsers.length > 0) {
//         res.status(400).send({ message: 'Email address already registered' });
//         return;
//       }

//       // 使用 bcrypt 加密密碼
//       const hashedPassword = await bcrypt.hash(pwd, 8);

//       // 使用正确的 SQL UPDATE 语句
//       const [results] = await connection.query(
//         'UPDATE users SET name = ?, email = ?, pwd = ? WHERE _id = ?', // 修改为正确的语法
//         [name, email, hashedPassword, req.user._id] // 使用 req.user._id 来指定要更新的用户
//       );

//       connection.release();

//       // 從資料庫撈出剛剛更新的帳號資料
//       const [updatedUser] = await connection.query(
//         'SELECT * FROM users WHERE _id = ?',
//         [req.user._id] // 使用 req.user._id 来获取更新后的用户
//       );

//       const token = generateToken(updatedUser[0]); // 生成 token 並反饋給前端
//       res.send({
//         _id: updatedUser[0].id,
//         name: updatedUser[0].name,
//         email: updatedUser[0].email,
//         roles: updatedUser[0].roles,
//         token: token,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: 'Internal Server Error' });
//     }
//   })
// );
// userRouter.put(
//   '/profile',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const { name, pwd } = req.body;
//     console.log(req.body);

//     try {
//       const connection = await db.getConnection();

//       // 使用 bcrypt 加密密碼
//       const hashedPassword = await bcrypt.hash(pwd, 8);

//       // 使用正确的 SQL UPDATE 语句
//       const [results] = await connection.query(
//         'UPDATE users SET name = ?, pwd = ? WHERE _id = ?',
//         [name, hashedPassword, req.user._id] // 使用 req.user._id 来指定要更新的用户
//       );

//       connection.release();

//       // 從資料庫撈出剛剛更新的帳號資料
//       const [updatedUser] = await connection.query(
//         'SELECT * FROM users WHERE _id = ?',
//         [req.user._id] // 使用 req.user._id 来获取更新后的用户
//       );

//       const token = generateToken(updatedUser[0]); // 生成 token 並反饋給前端
//       res.send({
//         _id: updatedUser[0].id,
//         name: updatedUser[0].name,
//         email: updatedUser[0].email,
//         roles: updatedUser[0].roles,
//         token: token,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: 'Internal Server Error' });
//     }
//   })
// );

userRouter.put(
  '/update-name',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { name } = req.body;

    try {
      const connection = await db.getConnection();

      // 使用正确的 SQL UPDATE 语句
      const [results] = await connection.query(
        'UPDATE users SET name = ? WHERE _id = ?',
        [name, req.user._id]
      );

      connection.release();

      // 從資料庫撈出剛剛更新的帳號資料
      const [updatedUser] = await connection.query(
        'SELECT * FROM users WHERE _id = ?',
        [req.user._id]
      );

      const token = generateToken(updatedUser[0]);
      res.send({
        _id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        roles: updatedUser[0].roles,
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);

userRouter.put(
  '/update-password',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { pwd, oldPwd } = req.body;

    try {
      const connection = await db.getConnection();

      // 先檢查舊密碼是否正確
      const [existingUser] = await connection.query(
        'SELECT * FROM users WHERE _id = ?',
        [req.user._id]
      );

      if (existingUser.length === 0) {
        connection.release();
        return res.status(401).send({ message: '使用者不存在' });
      }

      const isPasswordValid = await bcrypt.compare(oldPwd, existingUser[0].pwd);

      if (!isPasswordValid) {
        connection.release();
        return res.status(401).send({ message: '舊密碼不正確' });
      }

      // 使用 bcrypt 加密新密碼
      const hashedPassword = await bcrypt.hash(pwd, 8);

      // 使用正确的 SQL UPDATE 语句
      const [results] = await connection.query(
        'UPDATE users SET pwd = ? WHERE _id = ?',
        [hashedPassword, req.user._id]
      );

      connection.release();

      // 從資料庫撈出剛剛更新的帳號資料
      const [updatedUser] = await connection.query(
        'SELECT * FROM users WHERE _id = ?',
        [req.user._id]
      );

      const token = generateToken(updatedUser[0]);
      res.send({
        _id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        roles: updatedUser[0].roles,
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);

//新增忘記密碼的路由
userRouter.post(
  '/forgot-password',
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      const connection = await db.getConnection();

      // 確認重複信箱
      const [existingUsers] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length === 0) {
        res.status(400).send({ message: 'Email address not registered' });
        return;
      }

      // 生成重置密碼的 token
      const token = generateToken(existingUsers[0]);

      // 寄送重置密碼郵件
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // 使用的郵件服務提供者，可以根據需要更改
        auth: {
          user: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
          pass: (process.env.MAIL_PASS = 'myza ffmq yyid xlpq'),
        },
      });
      resetPasswordLink = `http://localhost:3000/resetpassword/${token}`;

      const mailOptions = {
        from: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
        to: email, // 收件人電子郵件地址
        subject: '重置密碼', // 郵件主題
        text: `請點擊以下連結重置密碼： ${resetPasswordLink}`, // 郵件內容

        html: `
        <![CDATA[
        ]]>
        <div className="container">
          <h1>重置密碼</h1>
          <p>親愛的拾月菓（ShiyueGuo）的忠實顧客，</p>
          <p>您最近要求重置您的密碼。請點擊以下連結重置密碼：</p>
          <p><a href="${resetPasswordLink}">${resetPasswordLink}</a></p>
          <p>如果您沒有要求重置密碼，請忽略此郵件。</p>
          <p>再次感謝您對拾月菓的支持。如果您有任何問題或建議，請隨時聯繫我們。</p>
          <p>祝您擁有美味的日式果子時光！</p>
          <p>拾月菓團隊</p>
        </div>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send({ message: '郵件發送失敗' });
        } else {
          console.log('郵件已發送：' + info.response);
          res.send({
            message: '重置密碼郵件已發送到您的電子郵件地址。請檢查您的收件箱。',
            token: token,
          });
        }
      });

      connection.release();
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);

//新增重置密碼的路由 使用者點選重置密碼的連結後，會跳轉到這個路由

userRouter.put(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { newPassword, token } = req.body;

    try {
      const connection = await db.getConnection();

      // 確認 token 是否有效
      const [users] = await connection.query(
        'SELECT * FROM users WHERE token = ?',

        [token]
      );

      if (users.length === 0) {
        res.status(401).send({ message: 'Invalid token' });
        return;
      }

      // 使用 bcrypt 加密新密碼
      const hashedPassword = await bcrypt.hash(newPassword, 8);

      // 使用正确的 SQL UPDATE 语句
      const [results] = await connection.query(
        'UPDATE users SET pwd = ? WHERE token = ?',
        [hashedPassword, token]
      );

      connection.release();

      res.send({ message: '密碼重置成功' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);

//定義一個路由，用來處理註冊請求

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const { name, email, pwd } = req.body;

    try {
      const connection = await db.getConnection();

      // 確認重複信箱
      const [existingUsers] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        res.status(400).send({ message: 'Email address already registered' });
        return;
      }

      // 使用 bcrypt 加密密碼
      const hashedPassword = await bcrypt.hash(pwd, 8);

      // 將新帳號資料 傳到資料庫
      const [results] = await connection.query(
        'INSERT INTO users (name, email, pwd) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      connection.release();

      // 從資料庫撈出剛剛新增的帳號資料
      const [newUser] = await connection.query(
        'SELECT * FROM users WHERE _id = ?',
        // 這裡的 results.insertId 是剛剛新增的帳號的 ID
        //insertId 是資料庫自動生成的 ID 代表剛剛生成的帳號的 ID
        [results.insertId]
      );

      const token = generateToken(newUser[0]); // 生成 token 並反饋給前端
      res.send({
        _id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        roles: newUser[0].roles,
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);
module.exports = userRouter;
