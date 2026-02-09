const pool = require('../config/db');

const userController = {
  // 获取所有用户列表
  getAllUsers: async (req, res) => {
    try {
      const [users] = await pool.query('SELECT * FROM users');
      res.status(200).json({
        success: true,
        data: users,
        message: '获取用户列表成功'
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取用户列表失败'
      });
    }
  },

  // 创建新用户
  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      res.status(201).json({
        success: true,
        data: newUser[0],
        message: '创建用户成功'
      });
    } catch (error) {
      console.error('创建用户失败:', error);
      res.status(500).json({
        success: false,
        message: '创建用户失败'
      });
    }
  },

  // 获取单个用户
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      res.status(200).json({
        success: true,
        data: users[0],
        message: '获取用户信息成功'
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.status(500).json({
        success: false,
        message: '获取用户信息失败'
      });
    }
  },

  // 更新用户信息
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const [result] = await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      res.status(200).json({
        success: true,
        data: updatedUser[0],
        message: '更新用户信息成功'
      });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      res.status(500).json({
        success: false,
        message: '更新用户信息失败'
      });
    }
  },

  // 删除用户
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      res.status(200).json({
        success: true,
        message: '删除用户成功'
      });
    } catch (error) {
      console.error('删除用户失败:', error);
      res.status(500).json({
        success: false,
        message: '删除用户失败'
      });
    }
  }
};

module.exports = userController;