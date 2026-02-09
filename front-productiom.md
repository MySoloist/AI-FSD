# 前端开发环境配置指南

## 项目概述
- **项目名称**：前端项目（Vue 3 + Vite）
- **目标目录**：frontend-backup
- **服务器信息**：公网 IP 为 8.130.158.39

## 打包前的准备工作

### 1. 确认 Node.js 环境
```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v
```

### 2. 进入项目目录
```bash
cd frontend-backup
```

## 详细配置步骤

### 步骤 1：重新安装项目依赖
```bash
# 安装依赖
npm install

# 安装成功后会显示类似信息
# up to date, audited 60 packages in 2s
# 12 packages are looking for funding
#   run `npm fund` for details
```

### 步骤 2：修改代理配置

修改 `vite.config.js` 文件，将代理指向远程服务器(相对于开发环境来说，生产环境的只是修改了API请求地址)：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({//配置正向代理
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://8.130.158.39:3000',
        changeOrigin: true
      }
    }
  }
})
```

### 步骤 3：启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 启动成功后会显示类似信息
# VITE v5.2.0  ready in 300 ms
# 
#  ➜  Local:   http://localhost:5173/
#  ➜  Network: use --host to expose
#  ➜  press h to show help
```

### 步骤 4：访问开发环境(确保后端在本地或者远程服务器上运行正常)

在浏览器中打开：
```
http://localhost:5173/
```

## 测试与调试

### 1. 测试 API 调用

开发服务器启动后，可以通过浏览器开发者工具的网络面板，查看 API 请求是否正确发送到远程服务器：

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 刷新页面或进行操作
4. 查看 API 请求的目标地址是否为 `http://8.130.158.39:3000/api/users`，有问题看问题4

### 2. 常见问题及解决方案

#### 问题 1：代理配置不生效
**解决方案**：
- 确认 `vite.config.js` 文件修改正确
- 重启开发服务器
- 清除浏览器缓存

#### 问题 2：API 调用失败
**解决方案**：
- 检查远程服务器是否正常运行
- 确认服务器端口是否为 3000
- 检查网络连接是否正常
- 查看浏览器控制台错误信息

#### 问题 3：CORS 跨域错误
**解决方案**：
- 确认服务器已配置 CORS 允许跨域请求
- 检查 `changeOrigin: true` 配置是否正确

#### 问题 4：在浏览器中看不到代理目标地址
**解决方案**：
- 由于 Vite 的代理是在开发服务器层面处理的，浏览器中看到的请求 URL 仍然是 `http://localhost:5173/api/users`
- 实际的请求已经被 Vite 代理到了远程服务器 `http://8.130.158.39:3000/api/users`
- 如何确认代理是否工作：
  1. 查看响应数据：如果能看到用户数据，说明代理工作正常
  2. 检查网络请求状态：请求状态码应该是 200 OK
  3. 对比直接访问：直接在浏览器中访问 `http://8.130.158.39:3000/api/users`，应该会看到相同的响应数据
- 操作步骤：
  1. 在浏览器开发者工具中，点击"Network"标签
  2. 点击页面上的"获取用户列表"按钮
  3. 查看 API 请求的状态和响应数据
  4. 确认请求状态码为 200 OK 且能看到用户数据

#### 问题 5：如何查看服务器是否已经允许 CORS 跨域
**解决方案**：
- **方法 1：使用浏览器开发者工具**
  1. 打开浏览器开发者工具（F12）
  2. 切换到 "Network" 标签
  3. 触发一个 API 请求（如点击"获取用户列表"按钮）
  4. 点击该 API 请求，查看请求详情
  5. 切换到 "Response Headers" 部分
  6. 查看是否存在以下 CORS 相关头信息：
     - `Access-Control-Allow-Origin`
     - `Access-Control-Allow-Methods`
     - `Access-Control-Allow-Headers`
     - `Access-Control-Max-Age`
- **正常的 CORS 响应头示例**：
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Max-Age: 86400
  ```

- **从浏览器截图分析**：
  从提供的浏览器开发者工具截图中可以看到：
  - 请求状态码：304 Not Modified（缓存响应）
  - 响应头包含：`Vary: Origin`（CORS 相关头信息）
  - 服务器使用：Express 框架
  - 这表明服务器已经配置了 CORS 相关的处理，前端能够正常获取数据

## 开发环境命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |

## 配置说明

### 代理配置详解(只修改了一处)

```javascript
proxy: {
  '/api': {
    target: 'http://8.130.158.39:3000', // 远程服务器地址
    changeOrigin: true // 允许跨域
  }
}
```

- **'/api'**：匹配所有以 `/api` 开头的请求
- **target**：请求转发的目标地址
- **changeOrigin**：修改请求头中的 Origin 字段，解决跨域问题

## 注意事项

1. **开发环境**：此配置仅用于开发环境，生产环境需要使用正式的构建和部署流程
2. **服务器状态**：确保远程服务器处于运行状态
3. **网络连接**：开发过程中需要保持网络连接稳定
4. **安全考虑**：开发环境配置不要包含敏感信息

## 部署准备

当开发完成后，可以执行以下命令构建生产版本：

```bash
# 构建生产版本
npm run build

# 构建产物会生成在 dist 目录中
```

构建完成后，可以将 `dist` 目录中的文件部署到生产服务器。

## 打包后的准备工作

### 前端打包完之后的部署配置

#### 问题 1：我将前端打包好的文件上传到服务器或者本地nginx上之后，是不是还要配置一些其它东西啊？打包好的文件不都是一堆静态文件吗？如果不配置的一些其他东西，它能有什么用啊？？
**答案**：
前端打包后的文件确实是一堆静态文件（HTML、CSS、JavaScript、图片等），但要让这些静态文件正常工作，需要进行以下配置：

- **静态文件服务器**：需要一个服务器来托管这些静态文件
- **路由配置**：处理单页应用的前端路由
- **API 代理配置**：确保前端能正确访问后端 API
- **CORS 配置**：处理跨域请求

#### 问题 2：如果不配置这些东西，打包好的文件有什么用？
**答案**：
如果不进行适当的配置，打包好的静态文件将无法正常工作，主要问题包括：

- **无法访问**：没有服务器托管，浏览器无法通过 HTTP 协议访问这些文件
- **路由失效**：单页应用的前端路由（如 /users、/about 等）会返回 404 错误
- **API 调用失败**：无法正确访问后端 API，导致功能无法使用
- **跨域错误**：浏览器会阻止跨域请求，导致数据无法加载

### 详细部署步骤

#### 步骤 1：构建前端项目
```bash
# 在前端目录中执行
npm run build

# 构建产物会生成在 dist 目录中
```

#### 步骤 2：部署静态文件

**方法 A：使用 Nginx 部署(即，修改服务里或者本地上的nginx.conf文件)**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    # 处理前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 配置 API 代理
    location /api {
        proxy_pass http://8.130.158.39:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
**方法 B：使用 Express 部署**
```javascript
const express = require('express');
const path = require('path');
const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 处理前端路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// API 路由（如果后端也在同一服务器）
// 或者配置代理指向后端服务器

app.listen(80, () => {
    console.log('Server running on port 80');
});
```

### 验证部署是否成功(确保后端在本地或者远程服务器上运行正常)

1. **访问前端应用**：在浏览器中打开部署后的 URL
2. **测试 API 调用**：点击"获取用户列表"等按钮，确认能正常获取数据
3. **检查网络请求**：使用开发者工具查看网络请求，确认 API 请求是否正确

这样配置后，您的前端应用就能正常工作，用户可以通过浏览器访问，并且能与后端 API 进行交互。
## 总结
总之，前端文件打包前，需要一些配置，打包之后，也需要一些配置，才能正常工作。