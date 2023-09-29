const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const { isAuth, generateToken } = require('../utils.js');

const orderRouter = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'japan',
  port: process.env.DB_PORT || 8080,
});
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log('Received order request:', req.body.orderItems);
    let connection;
    try {
      const connection = await pool.promise().getConnection(); // 獲取連接

      const newOrder = {
        orderItems: JSON.stringify(req.body.orderItems),
        shippingAddress: JSON.stringify(req.body.shippingAddress),
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        user_id: req.user._id,
      };

      const [results] = await connection.execute(
        'INSERT INTO orders (order_items, shipping_address, payment_method, items_price, shipping_price, total_price, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          newOrder.orderItems,
          newOrder.shippingAddress,
          newOrder.paymentMethod,
          newOrder.itemsPrice,
          newOrder.shippingPrice,
          newOrder.totalPrice,
          newOrder.user_id,
        ]
      );

      const order = {
        _id: results.insertId,
        ...newOrder,
      };

      // 確保連接被釋放回連接池
      connection.release();

      res.status(201).send({ message: 'New Order Created', order });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Order Creation Failed' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  })
);

//創建獲取歷史訂單路由

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    let connection;
    try {
      connection = await pool.promise().getConnection();

      const [orders] = await connection.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        //DESC是降序，ASC是升序
        [userId]
      );
      res.send(orders);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error fetching orders' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  })
);

//設定路由 /api/orders/:id 使用 mysqlOrderRouter
//用來顯示訂單資料
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    let connection;
    try {
      connection = await pool.promise().getConnection();

      //需要確保order 與user資料庫有關聯
      const [orderResult] = await connection.execute(
        'SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u._id WHERE o.id = ? AND o.user_id = ?',
        [orderId, userId]
      );

      if (orderResult.length === 1) {
        const order = orderResult[0];
        console.log('order:', order);
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error fetching order' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  })
);

function formatDateTime(dateTimeString) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Taipei', // 指定您的時區，這裡是台北時區
    // timeZoneName: 'short', 自動獲取使用者使區域設定的時區名稱
  };

  return new Date(dateTimeString).toLocaleString(undefined, options);
}

//設計路由 當使用者確認訂單送出後，自動寄信給使用者 傳送訂單資料
orderRouter.post(
  '/:id/send',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;
    const orderDetail = req.body;

    console.log('orderDetail:', orderDetail);
    let connection;

    try {
      connection = await pool.promise().getConnection();

      //使用 join 查詢訂單與用戶 前提是orders表中 有user_id列用於關聯
      const [orderResult] = await connection.execute(
        'SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u._id WHERE o.id = ? AND o.user_id = ?',
        [orderId, userId]
      );

      if (orderResult.length === 1) {
        const order = orderResult[0];
        console.log('order:', order);

        // 從訂單詳細信息中獲取用戶的電子郵件
        const userEmail = order.email;
        const orderDate = new Date(order.created_at); // 將訂單日期字符串轉換為日期對象
        const formattedOrderDate = formatDateTime(orderDate);
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
            pass: (process.env.MAIL_PASS = 'myza ffmq yyid xlpq'),
          },
        });
        const mailOptions = {
          from: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
          to: userEmail,
          subject: '拾月菓 - 您的訂單已下單',
          text: '您的訂單已下單',
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h1>訂單詳細信息</h1>
              <div>
                <h2>訂單編號</h2>
                <p>${order.id}</p>
              </div>
              <div>
                <h2>訂單日期</h2>
                <p>${formattedOrderDate}</p>
              </div>
              <div>
                <h2>訂單總額</h2>
                <p>${order.total_price}</p>
              </div>
              <div>
                <h2>付款方式</h2>
                <p>${order.payment_method}</p>
              </div>
              <div>
                <h2>是否付款</h2>
                <p>${order.is_paid ? '已付款 ' : '尚未付款'}</p>
              </div>
              <div>
                <h2>配送進度</h2>
                <p>
                  ${
                    order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : '尚未出貨'
                  }
                </p>
              </div>
              <div>
                <h2>訂單明細</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr>
                      <th style="border: 1px solid #ddd; padding: 8px;">商品名稱</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">數量</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">價格</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderDetail.orderItems
                      .map(
                        (item) => `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `,
        };
        // const mailOptions = {
        //   from: (process.env.MAIL_USER = 'eliotworkmail@gmail.com'),
        //   to: userEmail, // 使用提取的電子郵件地址
        //   subject: '您的訂單已下單',
        //   text: '您的訂單已下單',
        //   html: `<div>
        //     <h1>訂單詳細信息</h1>
        //     <div>
        //       <h2>訂單編號</h2>
        //       <p>${order.id}</p>
        //     </div>
        //     <div>
        //       <h2>訂單日期</h2>
        //       <p>${formattedOrderDate}</p>
        //     </div>
        //     <div>

        //       <h2>訂單總額</h2>
        //       <p>${order.total_price}</p>
        //     </div>
        //     <div>
        //       <h2>付款方式</h2>
        //       <p>${order.payment_method}</p>
        //     </div>
        //     <div>
        //       <h2>是否付款</h2>
        //       <p>${order.is_paid ? '已付款 ' : '尚未付款'}</p>
        //     </div>
        //     <div>
        //       <h2>配送進度</h2>
        //       <p>
        //         ${
        //           order.isDelivered
        //             ? order.deliveredAt.substring(0, 10)
        //             : '尚未出貨'
        //         }
        //       </p>
        //     </div>
        //     <div>
        //       <h2>訂單明細</h2>
        //       <p>
        //         <table>
        //           <thead>
        //             <tr>
        //               <th>商品名稱</th>
        //               <th>數量</th>
        //               <th>價格</th>
        //             </tr>
        //           </thead>
        //           <tbody>
        //             ${orderDetail.orderItems
        //               .map(
        //                 (item) => `
        //               <tr>
        //                 <td>${item.name}</td>
        //                 <td>${item.quantity}</td>
        //                 <td>${item.price}</td>
        //               </tr>
        //             `
        //               )
        //               .join('\n')}
        //           </tbody>
        //         </table>
        //       </p>
        //     </div>
        //   </div>`,
        // };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          }
          console.log('消息已發送：%s', info.messageId);
        });
        res.send({ message: '訂單已發送', order });
      } else {
        res.status(404).send({ message: '未找到訂單' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: '獲取訂單時出錯' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  })
);

//設計路由 當使用者確認訂單送出後，自動寄信給使用者 傳送訂單資料

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    let connection;
    try {
      connection = await pool.promise().getConnection();

      //使用 join 查詢訂單與用戶 前提是orders表中 有user_id列用於關聯
      const [orderResult] = await connection.execute(
        'SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u._id WHERE o.id = ? AND o.user_id = ?',
        [orderId, userId]
      );

      if (orderResult.length === 1) {
        const order = orderResult[0];
        console.log('order:', order);
        order.isPaid = true;
        order.paidAt = new Date();

        // 使用 execute 執行 SQL 查詢
        await connection.execute(
          'UPDATE orders SET is_paid = ?, paid_at = ? WHERE id = ?',
          [order.isPaid, order.paidAt, orderId]
        );
        order.is_paid = true;
        order.paid_at = new Date();
        res.send({ message: 'Order Paid', order });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error fetching order' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  })
);

module.exports = orderRouter;
