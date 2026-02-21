const pool = require('../config/db');
const logger = require('../config/logger');

const userController = {
  // 获取所有用户列表
  getAllUsers: async (req, res) => {
    const startTime = Date.now();
    logger.info('获取用户列表请求', { method: req.method, url: req.originalUrl });
    
    try {
      const [users] = await pool.query('SELECT * FROM users');
      const endTime = Date.now();
      logger.info('获取用户列表成功', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userCount: users.length
      });
      
      res.status(200).json({
        success: true,
        data: users,
        message: '获取用户列表成功'
      });
    } catch (error) {
      const endTime = Date.now();
      logger.error('获取用户列表失败', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '获取用户列表失败'
      });
    }
  },

  // 创建新用户
  createUser: async (req, res) => {
    const startTime = Date.now();
    logger.info('创建用户请求', {
      method: req.method,
      url: req.originalUrl,
      body: { ...req.body, password: '***' } // 隐藏密码
    });
    
    try {
      const { name, email, password } = req.body;
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      
      const endTime = Date.now();
      logger.info('创建用户成功', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: newUser[0].id,
        userName: newUser[0].name
      });
      
      res.status(201).json({
        success: true,
        data: newUser[0],
        message: '创建用户成功'
      });
    } catch (error) {
      const endTime = Date.now();
      logger.error('创建用户失败', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        body: { ...req.body, password: '***' }, // 隐藏密码
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '创建用户失败'
      });
    }
  },

  // 获取单个用户
  getUserById: async (req, res) => {
    const startTime = Date.now();
    logger.info('获取用户信息请求', {
      method: req.method,
      url: req.originalUrl,
      userId: req.params.id
    });
    
    try {
      const { id } = req.params;
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      
      if (users.length === 0) {
        const endTime = Date.now();
        logger.warn('用户不存在', {
          method: req.method,
          url: req.originalUrl,
          duration: endTime - startTime,
          userId: id
        });
        
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      const endTime = Date.now();
      logger.info('获取用户信息成功', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: users[0].id,
        userName: users[0].name
      });
      
      res.status(200).json({
        success: true,
        data: users[0],
        message: '获取用户信息成功'
      });
    } catch (error) {
      const endTime = Date.now();
      logger.error('获取用户信息失败', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: req.params.id,
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '获取用户信息失败'
      });
    }
  },

  // 更新用户信息
  updateUser: async (req, res) => {
    const startTime = Date.now();
    logger.info('更新用户信息请求', {
      method: req.method,
      url: req.originalUrl,
      userId: req.params.id,
      body: { ...req.body, password: '***' } // 隐藏密码
    });
    
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const [result] = await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]
      );
      
      if (result.affectedRows === 0) {
        const endTime = Date.now();
        logger.warn('用户不存在', {
          method: req.method,
          url: req.originalUrl,
          duration: endTime - startTime,
          userId: id
        });
        
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      const endTime = Date.now();
      logger.info('更新用户信息成功', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: updatedUser[0].id,
        userName: updatedUser[0].name
      });
      
      res.status(200).json({
        success: true,
        data: updatedUser[0],
        message: '更新用户信息成功'
      });
    } catch (error) {
      const endTime = Date.now();
      logger.error('更新用户信息失败', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: req.params.id,
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '更新用户信息失败'
      });
    }
  },

  // 删除用户
  deleteUser: async (req, res) => {
    const startTime = Date.now();
    logger.info('删除用户请求', {
      method: req.method,
      url: req.originalUrl,
      userId: req.params.id
    });
    
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        const endTime = Date.now();
        logger.warn('用户不存在', {
          method: req.method,
          url: req.originalUrl,
          duration: endTime - startTime,
          userId: id
        });
        
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      const endTime = Date.now();
      logger.info('删除用户成功', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: id
      });
      
      res.status(200).json({
        success: true,
        message: '删除用户成功'
      });
    } catch (error) {
      const endTime = Date.now();
      logger.error('删除用户失败', {
        method: req.method,
        url: req.originalUrl,
        duration: endTime - startTime,
        userId: req.params.id,
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        message: '删除用户失败'
      });
    }
  }
};

module.exports = userController;