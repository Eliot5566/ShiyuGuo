const express = require('express');
const mysql = require('mysql2/promise');
const productRouter = express.Router();

// 請根據你的 MySQL 連接設定進行修改
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'japan',
  port: process.env.DB_PORT || 8080, 
});

productRouter.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE onSale = 1');
    // const [products] = await connection.query('SELECT * FROM products');
    connection.release();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

productRouter.get('/slug/:slug', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [product] = await connection.query(
      'SELECT * FROM products WHERE slug = ? and onSale = 1',
      [req.params.slug]
    );
    connection.release();

    if (product.length > 0) {
      res.send(product[0]);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [product] = await connection.query(
      'SELECT * FROM products WHERE _id = ? and onSale = 1',
      [req.params.id]
    );
    connection.release();

    if (product.length > 0) {
      res.send(product[0]);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = productRouter;
