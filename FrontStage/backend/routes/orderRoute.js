const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const mysql = require('mysql2');

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
