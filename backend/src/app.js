const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 中间件配置
app.use(cors({
  origin: '*', // 允许所有来源，或指定前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 注册路由
app.use('/api/users', userRoutes); // 注意：根据 userRoutes.js 中的配置，这里使用 /api/users 作为前缀

// 根路径
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to User Management API' });
});

module.exports = app;