//目前資料庫格視為 資料表users
//name   email   password   isAdmin(0,1)   age   _id (主鍵)
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const userRouter = express.Router();
const { isAuth, generateToken } = require('../utils.js'); // 請確保 utils.js 的路徑正確

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
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { name, pwd, oldPwd } = req.body;

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
        'UPDATE users SET name = ?, pwd = ? WHERE _id = ?',
        [name, hashedPassword, req.user._id]
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

// userRouter.put(
//   '/profile',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const { name, email, pwd } = req.body;

//     try {
//       const connection = await db.getConnection();

//       // 確認重複信箱，但要排除当前用户
//       const [existingUsers] = await connection.query(
//         'SELECT * FROM users WHERE email = ? AND _id <> ?',
//         [email, req.user.id]
//       );

//       if (existingUsers.length > 0) {
//         res.status(400).send({ message: 'Email address already registered' });
//         return;
//       }

//       // 使用 bcrypt 加密新密码
//       const hashedPassword = await bcrypt.hash(pwd, 8);

//       // 更新用户资料
//       await connection.query(
//         'UPDATE users SET name = ?, email = ?, pwd = ? WHERE _id = ?',
//         [name, email, hashedPassword, req.user.id]
//       );

//       connection.release();

//       // 获取更新后的用户资料
//       const [updatedUser] = await connection.query(
//         'SELECT * FROM users WHERE _id = ?',
//         [req.user.id]
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
