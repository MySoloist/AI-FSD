# 使用 Node.js 16 作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制后端文件
COPY backend/package*.json ./backend/
COPY backend/src ./backend/src
COPY backend/init-db.sql ./backend/

# 复制前端构建产物
COPY frontend/dist ./frontend/dist

# 安装后端依赖
RUN cd backend && npm install --production

# 安装 MySQL 客户端（用于初始化数据库）
RUN apk add --no-cache mysql-client

# 暴露后端端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动命令
CMD ["sh", "-c", "cd backend && npm start"]
