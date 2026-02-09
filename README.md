# API 接口详细设计

## 项目概述
本项目实现一个简单的用户管理系统，提供基本的 CRUD 操作 API 接口，用于学习和测试 API 接口的实现与测试。

## 技术栈
- 前端：Vue.js + Postman 工具（用于 API 测试）
- 后端：Node.js + Express
- 数据库：MySQL

## 项目结构
```
├── .trae/                # Trae IDE 配置和文档目录
│   ├── documents/        # 项目文档
│   │   ├── 任务一：数据库设计与创建执行计划.md  # 数据库设计文档
│   │   └── 任务四：API 接口实现执行计划.md     # API 实现文档
│   └── rules/            # 项目规则配置
│       └── project_rules.md  # 项目规则文件
├── src/                  # 后端源代码目录
│   ├── config/           # 配置文件目录
│   │   └── db.js         # 数据库连接配置
│   ├── controllers/      # 控制器目录
│   │   └── userController.js  # 用户控制器，实现业务逻辑
│   ├── routes/           # 路由目录
│   │   └── userRoutes.js      # 用户路由，定义 API 路径
│   ├── app.js            # Express 应用实例，配置中间件和路由
│   └── index.js          # 服务器启动文件，启动 Express 服务器
├── frontend/             # 前端源代码目录
│   ├── src/              # Vue 源代码
│   │   ├── components/   # Vue 组件
│   │   ├── views/        # 页面视图
│   │   ├── router/       # 路由配置
│   │   ├── api/          # API 调用
│   │   ├── assets/       # 静态资源
│   │   ├── App.vue       # 根组件
│   │   └── main.js       # 入口文件
│   ├── public/           # 公共静态资源
│   ├── index.html        # HTML 模板
│   ├── package.json      # 前端依赖配置
│   └── vite.config.js    # Vite 配置文件
├── README.md             # 项目说明文档
├── UsePostman.md         # Postman 测试指南
├── init-db.sql           # 数据库初始化脚本，创建表结构和测试数据
├── package-lock.json     # npm 依赖版本锁定文件
├── package.json          # npm 项目配置文件，定义依赖和脚本
├── project-tasks-issues.md  # 项目任务和问题记录
├── project-tasks.md      # 项目任务列表
```

### 项目结构说明

| 目录/文件 | 类型 | 用途 |
|----------|------|------|
| `.trae/` | 目录 | Trae IDE 的配置和文档目录，包含项目相关的计划和规则 |
| `src/` | 目录 | 后端源代码目录，包含所有业务逻辑和配置 |
| `src/config/` | 目录 | 配置文件目录，存放数据库连接等配置 |
| `src/controllers/` | 目录 | 控制器目录，实现 API 的业务逻辑 |
| `src/routes/` | 目录 | 路由目录，定义 API 接口的 URL 路径 |
| `src/app.js` | 文件 | Express 应用实例，配置中间件和注册路由 |
| `src/index.js` | 文件 | 服务器启动文件，启动 Express 服务器并监听端口 |
| `frontend/` | 目录 | 前端源代码目录，包含 Vue 项目代码 |
| `frontend/src/` | 目录 | Vue 源代码目录 |
| `frontend/src/components/` | 目录 | Vue 组件目录 |
| `frontend/src/views/` | 目录 | 页面视图目录 |
| `frontend/src/router/` | 目录 | 前端路由配置目录 |
| `frontend/src/api/` | 目录 | API 调用封装目录 |
| `frontend/src/assets/` | 目录 | 静态资源目录 |
| `frontend/src/App.vue` | 文件 | Vue 根组件 |
| `frontend/src/main.js` | 文件 | Vue 应用入口文件 |
| `frontend/public/` | 目录 | 公共静态资源目录 |
| `frontend/index.html` | 文件 | HTML 模板文件 |
| `frontend/package.json` | 文件 | 前端项目依赖配置文件 |
| `frontend/vite.config.js` | 文件 | Vite 构建工具配置文件 |
| `README.md` | 文件 | 项目说明文档，包含 API 设计和使用说明 |
| `UsePostman.md` | 文件 | Postman 测试指南，详细说明如何使用 Postman 测试 API |
| `init-db.sql` | 文件 | 数据库初始化脚本，用于创建表结构和插入测试数据 |
| `package.json` | 文件 | npm 项目配置文件，定义项目依赖和脚本命令 |
| `package-lock.json` | 文件 | npm 依赖版本锁定文件，确保依赖版本一致性 |
| `project-tasks-*` | 文件 | 项目任务和问题记录，用于项目管理 |
| `query` | 文件 | 查询相关文件，可能包含 SQL 查询语句 |

## API 接口设计

### 1. 获取所有用户列表
- **URL**：`/api/users`
- **方法**：GET
- **描述**：获取数据库中所有用户的列表
- **响应格式**：
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "password": "password123",
        "created_at": "2026-02-03T19:55:30.000Z"
      },
      ...
    ],
    "message": "获取用户列表成功"
  }
  ```

### 2. 创建新用户
- **URL**：`/api/users`
- **方法**：POST
- **描述**：创建一个新用户
- **请求体**：
  ```json
  {
    "name": "John",
    "email": "john@example.com",
    "password": "password789"
  }
  ```
- **响应格式**：
  ```json
  {
    "success": true,
    "data": {
      "id": 4,
      "name": "John",
      "email": "john@example.com",
      "password": "password789",
      "created_at": "2026-02-03T20:30:00.000Z"
    },
    "message": "创建用户成功"
  }
  ```

### 3. 获取单个用户
- **URL**：`/api/users/:id`
- **方法**：GET
- **描述**：根据用户 ID 获取单个用户信息
- **响应格式**：
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "password": "password123",
      "created_at": "2026-02-03T19:55:30.000Z"
    },
    "message": "获取用户信息成功"
  }
  ```

### 4. 更新用户信息
- **URL**：`/api/users/:id`
- **方法**：PUT
- **描述**：根据用户 ID 更新用户信息
- **请求体**：
  ```json
  {
    "name": "Alice Smith",
    "email": "alice.smith@example.com",
    "password": "newpassword123"
  }
  ```
- **响应格式**：
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Alice Smith",
      "email": "alice.smith@example.com",
      "password": "newpassword123",
      "created_at": "2026-02-03T19:55:30.000Z"
    },
    "message": "更新用户信息成功"
  }
  ```

### 5. 删除用户
- **URL**：`/api/users/:id`
- **方法**：DELETE
- **描述**：根据用户 ID 删除用户
- **响应格式**：
  ```json
  {
    "success": true,
    "message": "删除用户成功"
  }
  ```

## 错误处理
所有 API 接口在遇到错误时，返回以下格式的响应：

```json
{
  "success": false,
  "message": "错误信息"
}
```

### 常见错误信息
- "获取用户列表失败"：数据库查询失败
- "创建用户失败"：数据库插入失败
- "获取用户信息失败"：数据库查询失败
- "用户不存在"：根据 ID 未找到用户
- "更新用户信息失败"：数据库更新失败
- "删除用户失败"：数据库删除失败

## 数据库表结构

### users 表
| 字段名 | 数据类型 | 约束 | 描述 |
| --- | --- | --- | --- |
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 用户 ID |
| name | VARCHAR(255) | NOT NULL | 用户名 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 邮箱 |
| password | VARCHAR(255) | NOT NULL | 密码 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

## 测试数据
数据库中已包含以下测试数据：

| id | name | email | password | created_at |
| --- | --- | --- | --- | --- |
| 1 | Alice | alice@example.com | password123 | 2026-02-03 19:55:30 |
| 2 | Bob | bob@example.com | password456 | 2026-02-03 19:55:30 |
| 3 | Charlie | charlie@example.com | password789 | 2026-02-03 19:55:30 |

## 启动服务
使用以下命令启动后端服务：

### 开发模式（支持自动重启）
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

服务默认运行在 `http://localhost:3000` 端口。

## 测试指南
详细的 Postman 测试指南请参考 [UsePostman.md](UsePostman.md) 文件。