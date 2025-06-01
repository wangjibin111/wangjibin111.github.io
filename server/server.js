const express = require('express');
const mysql = require('mysql2');
const app = express();

// 解析JSON请求体
app.use(express.json());

// 允许跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'mysql2.sqlpub.com',         // 数据库地址
  user: 'wangjibin',                 // 用户名
  password: 'i8pKe3GrcoM6JorK',       // 密码
  database: 'wjb_hybgl',             // 数据库名称
  port: 3307                        // 数据库端口
});

// 查询积分接口
app.get('/query', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM score ORDER BY student_id ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 加分接口
app.post('/addPoints', async (req, res) => {
  const { student_id, score } = req.body;
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO score (student_id, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = score + ?',
      [student_id, score, score]
    );
    res.json({ success: true, message: '加分成功', result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 扣分接口
app.post('/subPoints', async (req, res) => {
  const { student_id, score } = req.body;
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO score (student_id, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = score - ?',
      [student_id, score, score]
    );
    res.json({ success: true, message: '扣分成功', result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 清空积分接口
app.post('/clear', async (req, res) => {
  try {
    const [result] = await pool.promise().query('UPDATE score SET score = 0');
    res.json({ success: true, message: '积分已清空', result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 启动服务，监听3000端口
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`后端服务已启动，端口：${PORT}`);
});