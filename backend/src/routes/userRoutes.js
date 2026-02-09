const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// 获取所有用户列表
router.get('/', userController.getAllUsers);

// 创建新用户
router.post('/', userController.createUser);

// 获取单个用户
router.get('/:id', userController.getUserById);

// 更新用户信息
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;