# Postman 测试指南

## 1. 测试环境准备

### 1.1 安装 Postman
确保已安装最新版本的 Postman 工具。如果尚未安装，可以从 [Postman 官网](https://www.postman.com/downloads/) 下载并安装。

### 1.2 创建测试集合
1. 打开 Postman 工具
2. 点击左上角的 "New" 按钮
3. 选择 "Collection"
4. 输入集合名称：`User Management API Tests`
5. 添加描述：`测试用户管理系统的 CRUD API 接口`
6. 点击 "Create" 按钮完成创建

### 1.3 设置环境变量（可选）
为了方便测试，可以设置环境变量：
1. 点击右上角的 "Environment" 按钮
2. 点击 "Add" 创建新环境
3. 输入环境名称：`Local Development`
4. 添加变量：
   - 变量名：`base_url`
   - 值：`http://localhost:3000`
5. 点击 "Save" 按钮保存环境配置

## 2. 测试请求创建

为每个 API 接口创建一个测试请求，按照以下步骤操作：

### 2.1 获取所有用户列表
- **请求名称**：`Get All Users`
- **HTTP 方法**：GET
- **请求 URL**：`{{base_url}}/api/users` 或 `http://localhost:3000/api/users`
- **测试要点**：
  - 验证响应状态码为 200 OK
  - 验证响应体包含 `success: true`
  - 验证响应体包含 `data` 数组
  - 验证 `data` 数组中包含初始测试数据（Alice、Bob、Charlie）

### 2.2 创建新用户
- **请求名称**：`Create New User`
- **HTTP 方法**：POST
- **请求 URL**：`{{base_url}}/api/users` 或 `http://localhost:3000/api/users`
- **请求体**（JSON 格式）：
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **测试要点**：
  - 验证响应状态码为 201 Created
  - 验证响应体包含 `success: true`
  - 验证响应体包含 `data` 对象
  - 验证 `data` 对象中的 `name`、`email` 与请求体一致
  - 验证返回了新用户的 `id`

### 2.3 获取单个用户
- **请求名称**：`Get Single User`
- **HTTP 方法**：GET
- **请求 URL**：`{{base_url}}/api/users/1` 或 `http://localhost:3000/api/users/1`（使用存在的用户 ID）
- **测试要点**：
  - 验证响应状态码为 200 OK
  - 验证响应体包含 `success: true`
  - 验证响应体包含 `data` 对象
  - 验证 `data` 对象中的 `id` 与 URL 中的 ID 一致
  - 验证返回了正确的用户信息

### 2.4 更新用户信息
- **请求名称**：`Update User`
- **HTTP 方法**：PUT
- **请求 URL**：`{{base_url}}/api/users/1` 或 `http://localhost:3000/api/users/1`（使用存在的用户 ID）
- **请求体**（JSON 格式）：
  ```json
  {
    "name": "Alice Smith",
    "email": "alice.smith@example.com",
    "password": "newpassword123"
  }
  ```
- **测试要点**：
  - 验证响应状态码为 200 OK
  - 验证响应体包含 `success: true`
  - 验证响应体包含 `data` 对象
  - 验证 `data` 对象中的 `name`、`email` 与请求体一致
  - 验证 `data` 对象中的 `id` 与 URL 中的 ID 一致

### 2.5 删除用户
- **请求名称**：`Delete User`
- **HTTP 方法**：DELETE
- **请求 URL**：`{{base_url}}/api/users/4` 或 `http://localhost:3000/api/users/4`（使用刚创建的用户 ID）
- **测试要点**：
  - 验证响应状态码为 200 OK
  - 验证响应体包含 `success: true`
  - 验证响应体包含 `message: "删除用户成功"`

## 3. 测试执行顺序

按照以下顺序执行测试，以确保测试流程的连贯性：

1. **获取所有用户列表**：验证初始数据是否正确
2. **创建新用户**：验证 POST 接口功能
3. **获取单个用户**：验证 GET 单个用户接口功能
4. **更新用户信息**：验证 PUT 接口功能
5. **删除用户**：验证 DELETE 接口功能
6. **再次获取所有用户列表**：验证删除操作是否成功，确认用户列表已更新

## 4. 错误情况测试

除了正常情况的测试外，还应测试以下错误情况：

### 4.1 获取不存在的用户
- **请求**：GET `{{base_url}}/api/users/999`（使用不存在的用户 ID）
- **预期结果**：
  - 响应状态码：404 Not Found
  - 响应体：`{"success": false, "message": "用户不存在"}`

### 4.2 创建重复邮箱的用户
- **请求**：POST `{{base_url}}/api/users`，使用已存在的邮箱
- **请求体**（示例）：
  ```json
  {
    "name": "Duplicate User",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **预期结果**：
  - 响应状态码：500 Internal Server Error
  - 响应体：`{"success": false, "message": "创建用户失败"}`（数据库唯一约束错误）

### 4.3 更新不存在的用户
- **请求**：PUT `{{base_url}}/api/users/999`，使用不存在的用户 ID
- **请求体**（示例）：
  ```json
  {
    "name": "Non-existent User",
    "email": "non-existent@example.com",
    "password": "password123"
  }
  ```
- **预期结果**：
  - 响应状态码：404 Not Found
  - 响应体：`{"success": false, "message": "用户不存在"}`

### 4.4 删除不存在的用户
- **请求**：DELETE `{{base_url}}/api/users/999`，使用不存在的用户 ID
- **预期结果**：
  - 响应状态码：404 Not Found
  - 响应体：`{"success": false, "message": "用户不存在"}`

### 4.5 缺少必填字段
- **请求**：POST `{{base_url}}/api/users`，缺少 `name` 字段
- **请求体**（示例）：
  ```json
  {
    "email": "missing-name@example.com",
    "password": "password123"
  }
  ```
- **预期结果**：
  - 响应状态码：500 Internal Server Error
  - 响应体：`{"success": false, "message": "创建用户失败"}`（数据库非空约束错误）

## 5. 常见问题及解决方案

### 5.1 服务启动失败
- **问题**：执行 `npm run dev` 后服务无法启动
- **可能原因**：
  - 端口 3000 已被占用
  - 数据库连接失败
  - 代码存在语法错误
- **解决方案**：
  - 检查端口占用情况，使用其他端口或关闭占用端口的进程
  - 确认 MySQL 服务已启动，数据库连接配置正确
  - 检查代码语法，修复错误

### 5.2 数据库连接错误
- **问题**：API 接口返回 "获取用户列表失败" 等数据库相关错误
- **可能原因**：
  - MySQL 服务未启动
  - 数据库 `test_db` 不存在
  - 数据库用户权限不足
- **解决方案**：
  - 启动 MySQL 服务
  - 确认数据库已创建：`CREATE DATABASE IF NOT EXISTS test_db;`
  - 确认用户权限正确：`GRANT ALL PRIVILEGES ON test_db.* TO 'root'@'localhost';`

### 5.3 测试数据问题
- **问题**：测试时数据状态不一致
- **解决方案**：
  - 测试前重置数据库状态
  - 使用事务确保测试数据的一致性
  - 为每个测试使用独立的测试数据

---

通过本测试指南，您可以全面验证 API 接口的功能和可靠性，确保用户管理系统能够正常运行。如果在测试过程中遇到问题，请参考常见问题及解决方案部分，或查阅相关文档寻求帮助。