# 项目 Docker 镜像构建与运行教程

本教程将详细介绍如何将本项目（前端 Vue + 后端 Node.js + 数据库 MySQL）打包为 Docker 镜像并在 Docker 中运行。

## 一、前提条件

在开始前，请确保你的本地环境已安装以下工具：

- **Docker**：[Docker Desktop](https://www.docker.com/products/docker-desktop/)（Windows/Mac）或 Docker Engine（Linux）
- **Git**：用于克隆项目代码（如未克隆）
- **Node.js**：用于构建前端代码（如前端未构建）

### 重要说明
- **Windows/Mac 用户**：在执行构建和运行命令前，请确保 Docker Desktop 已启动并正常运行。
- **Docker Desktop 状态**：启动后，等待状态栏显示 "Docker Desktop is running" 再执行命令。
- **Linux 用户**：确保 Docker 服务已启动（可通过 `sudo systemctl start docker` 命令启动）。
- **网络环境**：建议配置 Docker 镜像加速器，提高镜像拉取速度并避免网络连接问题。

### 配置 Docker 镜像加速器(如何可以科学上网，则无需配置)


### 镜像加速器或者科学上网的使用场景

#### 何时需要配置镜像加速器或者科学上网
- **从 Docker Hub 拉取镜像时**：当你的项目依赖基础镜像（如 Node.js、MySQL、Nginx 等）时
- **首次构建项目时**：构建过程中需要拉取基础镜像
- **上传镜像到 Docker Hub 时**：虽然影响较小，但仍可提高速度

#### 何时不需要配置镜像加速器或者科学上网
- **仅使用本地构建的镜像时**：完全在本地环境中构建和运行容器
- **不依赖任何 Docker Hub 基础镜像时**：项目完全不使用任何来自 Docker Hub 的镜像
- **已经拥有所需的所有基础镜像时**：基础镜像已在本地缓存，不需要再次拉取

#### 实际应用考虑
在实际应用中，大多数项目都会依赖一些基础镜像（如 Node.js、MySQL 等），这些基础镜像通常需要从 Docker Hub 拉取。因此，即使你主要使用本地构建的镜像，配置镜像加速器仍然可以提高首次构建的速度。

如果你确定你的项目完全不依赖任何 Docker Hub 上的镜像，那么确实可以不配置镜像加速器或者科学上网。

#### Ping 测试失败的原因
- **症状**：执行 `ping docker.mirrors.ustc.edu.cn` 显示 "Request timed out" 或 "Destination host unreachable"
- **原因**：很多镜像加速器服务器配置为不响应 ICMP ping 请求，但仍然可以正常提供镜像加速服务
- **解决**：不要使用 ping 测试镜像加速器是否可用，而是使用以下方法：
  - **测试域名解析**：`nslookup docker.mirrors.ustc.edu.cn`
  - **测试 HTTP 连接**：`curl -I https://docker.mirrors.ustc.edu.cn`
  - **直接尝试拉取镜像**：`docker pull hello-world`

#### 备选方案
- **使用 Docker 官方镜像**：尝试直接从 Docker Hub 拉取镜像，不使用镜像加速器
- **使用离线镜像**：在网络良好的环境中下载镜像，然后导入到本地
- **检查网络代理设置**：如果使用了网络代理，确保 Docker 已正确配置代理设置

## 二、项目结构说明

本项目采用前后端分离架构：

```
├── backend/              # 后端代码（Node.js + Express）
│   ├── src/              # 后端源代码
│   │   ├── config/       # 配置文件（如数据库连接）
│   │   ├── controllers/  # 控制器（业务逻辑）
│   │   ├── routes/       # 路由（API 路径）
│   │   ├── app.js        # Express 应用实例
│   │   └── index.js      # 服务器启动文件
│   ├── init-db.sql       # 数据库初始化脚本
│   └── package.json      # 后端依赖配置
├── frontend/             # 前端代码（Vue.js）
│   ├── dist/             # 前端构建产物（已构建）
│   └── src/              # 前端源代码
├── Dockerfile            # Docker 镜像构建文件
└── docker-compose.yml    # Docker Compose 配置文件
```

## 三、Docker 配置文件说明

### 1. Dockerfile

`Dockerfile` 用于定义如何构建 Docker 镜像(也就是构建docker的流程,即构建镜像的步骤)：

```dockerfile
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
```

### 2. docker-compose.yml

`docker-compose.yml` 用于定义和管理多容器应用：

```yaml
version: '3.8'

services:
  # 后端服务
  backend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=123456
      - DB_NAME=test_db
    restart: unless-stopped

  # MySQL 数据库服务
  db:
    image: mysql:8.0
    ports:
      - "3307:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=test_db
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    restart: unless-stopped

volumes:
  mysql_data:
```

## 四、构建与运行步骤

### 步骤 1：准备前端构建产物

如果前端代码尚未构建（即 `frontend/dist/` 目录不存在），请执行以下步骤：

1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 构建前端代码：
   ```bash
   npm run build
   ```

   构建完成后，会生成 `frontend/dist/` 目录，包含前端静态文件。

### 步骤 2：构建 Docker 镜像并运行

1. 回到项目根目录：
   ```bash
   cd ..
   ```

2. **确保 Docker Desktop 已启动**（Windows/Mac 用户）或 Docker 服务已运行（Linux 用户）。

3. 使用 Docker Compose 构建并运行服务：
   ```bash
   docker-compose up -d --build
   ```

   命令说明：
   - `-d`：后台运行容器
   - `--build`：构建镜像（首次运行或修改代码后需要）

   **镜像存储位置**：
   - 执行此命令时，Docker 会将镜像构建到**本地** Docker 引擎的镜像仓库中
   - 构建的镜像不会自动上传到 Docker Hub,还需要执行相应的命令才能上传
   - 可以通过 `docker images` 命令查看本地存储的所有镜像，包括刚刚构建的项目镜像

### docker-compose up -d 与 docker-compose up -d --build 的区别

#### 命令执行差异
- **`docker-compose up -d`**：直接启动容器，使用现有的镜像
- **`docker-compose up -d --build`**：在启动容器前先构建镜像，然后再启动容器

#### 适用场景
- **`docker-compose up -d`**：
  - 镜像已经构建完成，不需要重新构建
  - 项目代码没有修改，不需要重新构建
  - 快速启动已有的容器

- **`docker-compose up -d --build`**：
  - 首次运行项目，需要构建镜像
  - 项目代码有修改，需要重新构建镜像
  - 依赖的基础镜像有更新，需要重新构建

#### 执行流程
- **`docker-compose up -d`**：
  1. 检查本地是否有对应的镜像
  2. 如果没有，从 Docker Hub 拉取
  3. 使用镜像启动容器
  4. 后台运行容器

- **`docker-compose up -d --build`**：
  1. 根据 `docker-compose.yml` 中的配置构建镜像
  2. 构建完成后，使用新构建的镜像启动容器
  3. 后台运行容器

#### 实际应用建议
- **开发环境**：频繁修改代码时，使用 `docker-compose up -d --build` 确保镜像始终最新
- **生产环境**：镜像构建和部署分离，先构建镜像，然后使用 `docker-compose up -d` 启动
- **快速测试**：如果镜像已经构建且代码未修改，使用 `docker-compose up -d` 快速启动

4. 查看容器状态：
   ```bash
   docker-compose ps
   ```

   正常情况下，会显示两个容器（backend 和 db）状态为 `Up`。

## 五、验证服务是否正常运行

### 1. 检查后端服务

- 访问后端 API 接口：
  ```bash
  curl http://localhost:3000/api/users
  ```

  预期响应（返回用户列表）：
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
      {
        "id": 2,
        "name": "Bob",
        "email": "bob@example.com",
        "password": "password456",
        "created_at": "2026-02-03T19:55:30.000Z"
      }
    ],
    "message": "获取用户列表成功"
  }
  ```

### 2. 检查前端服务

前端静态文件已集成到后端容器中，可通过后端服务访问：

- 访问前端页面：
  ```
  http://localhost:3000/frontend/dist/
  ```

  或直接访问：
  ```
  http://localhost:3000/
  ```

  预期：显示前端应用的首页，包含用户列表等内容。

## 六、管理容器

### 1. 停止服务

```bash
docker-compose down
```

### 2. 重启服务

```bash
docker-compose restart
```

### 3. 查看日志

- 查看所有容器日志：
  ```bash
  docker-compose logs
  ```

- 查看特定容器日志（如后端）：
  ```bash
  docker-compose logs backend
  ```

## 七、常见问题及解决方案

### 1. Docker 引擎连接失败

- **症状**：执行命令时显示 "cannot find the file specified" 或 "failed to connect to the docker API"。
- **原因**：Docker Desktop 未启动，或 Docker 引擎服务未运行。
- **解决**：
  - Windows/Mac 用户：启动 Docker Desktop 应用程序，等待状态栏显示 "Docker Desktop is running"。
  - Linux 用户：启动 Docker 服务，执行 `sudo systemctl start docker` 命令。


### 2. 前端页面无法访问

- **症状**：访问 `http://localhost:3000/` 显示 "404 Not Found"。
- **原因**：前端构建产物未正确复制到容器中，或后端未配置静态文件服务。
- **解决**：
  - 确保执行了 `npm run build` 生成 `frontend/dist/` 目录。
  - 检查后端 `app.js` 是否配置了静态文件服务（如 `app.use(express.static('../frontend/dist'))`）。

### 3. 端口被占用

- **症状**：启动容器时显示 "Port 3000 is already in use"。
- **原因**：本地其他服务占用了 3000 端口。
- **解决**：
  - 修改 `docker-compose.yml` 中的端口映射，如改为 `"3001:3000"`。
  - 停止占用 3000 端口的本地服务。

### 4. 本地数据库端口与 Docker容器中的数据库端口相互冲突

- **症状**：启动容器时显示 "ports are not available: exposing port TCP 0.0.0.0:3306 -> 127.0.0.1:0: listen tcp 0.0.0.0:3306: bind: Only one usage of each socket address (protocol/network address/port) is normally permitted"。
- **原因**：本地已经有 MySQL 服务在运行，占用了 3306 端口，与 Docker 容器尝试使用的端口冲突。
- **解决**：
  - 修改 `docker-compose.yml` 文件中数据库服务的端口映射，将容器端口映射到主机的其他端口，例如：
    ```yaml
    ports:
      - "3307:3306"
    ```
  - 这样 Docker 容器的 3306 端口会映射到主机的 3307 端口，避免与本地 MySQL 服务冲突。

- **注意事项**：
  - 后端服务连接数据库时使用的是容器内部网络，因此不需要修改后端的数据库连接配置
  - 容器内部仍然使用 `3306` 端口，只是对外映射到了主机的其他端口
  - 如需从主机直接连接容器中的 MySQL，应使用 `localhost:3307`（根据你设置的映射端口）

- **验证方法**：
  - 执行 `netstat -ano | findstr :3306`（Windows）或 `lsof -i :3306`（Linux/Mac）检查本地端口占用情况
  - 确认 Docker 容器启动后，使用 `docker-compose ps` 查看容器状态
  
- **网络访问**：
    - **本地数据库**：通过 `localhost:3306` 访问（使用默认端口）
    - **Docker数据库**：
      - 在容器内部通过 `localhost:3306` 访问
      - 从主机访问需要通过映射的端口，如 `localhost:3307`（根据配置）

### 5. 镜像拉取失败 

- **症状**：执行构建命令时显示 "failed to resolve reference docker.io/library/mysql:8.0" 或 "connectex: A connection attempt failed"。
- **原因**：网络连接问题，无法连接到 Docker Hub 镜像仓库。
- **解决**：
  - 检查网络连接是否正常，确保可以访问互联网。
  - 尝试更换网络环境，如使用手机热点。
  - 配置 Docker 镜像加速器（如阿里云、网易云等），提高镜像拉取速度。
  - 等待一段时间后重试，可能是 Docker Hub 临时故障。
### 7. 通过科学上网解决了DockerHub的访问问题(即解决了镜像拉取失败的问题)，但是没有解决认证问题。

- **症状**：无法访问 Docker Hub，执行构建命令时显示网络连接错误
- **原因**：网络环境限制导致无法正常访问 Docker Hub
- **解决**：
  - **使用科学上网工具**：
    1. 启用科学上网工具
    2. **选择合适的节点**：尝试使用新加坡、美国等节点，避免使用日本节点（可能效果不佳）
    3. 确保科学上网工具处于全局模式或已正确代理 Docker 的网络流量

### 8. Docker Hub 认证服务连接失败

- **症状**：执行构建命令时显示 "failed to fetch anonymous token: Get https://auth.docker.io/token?scope=repository%3Alibrary%2Fnode%3Apull&service=registry.docker.io: dial tcp: connectex: A connection attempt failed"
- **原因**：虽然可以访问 Docker Hub 网站，但 Docker 命令行工具无法连接到 Docker Hub 的认证服务，可能是网络路由、防火墙或 DNS 问题
- **解决**：
  - **手动拉取基础镜像**：
    ```bash
    # 手动拉取基础镜像
    docker pull node:16-alpine
    docker pull mysql:8.0
    
    # 然后再构建项目
    docker-compose up -d --build
    ```

#### 为什么手动拉取基础镜像后再构建能成功？

- **问题**：为什么先执行 `docker pull node:16-alpine` 和 `docker pull mysql:8.0`，然后再执行 `docker-compose up -d --build` 能够成功构建？

- **答案**：
  1. **本地镜像缓存原理**：当你手动执行 `docker pull` 拉取基础镜像时，Docker 会将这些镜像存储到本地的镜像缓存中
  2. **构建时的镜像查找顺序**：执行 `docker-compose up -d --build` 时，Docker 会先在本地镜像缓存中查找所需的基础镜像
  3. **绕过认证流程**：如果本地已经存在所需的基础镜像，Docker 就不会尝试从 Docker Hub 拉取镜像，从而绕过了需要认证的网络请求
  4. **认证失败的根本原因**：之前的构建失败是因为 Docker 在拉取基础镜像时需要向 Docker Hub 认证服务请求匿名 token，但网络连接失败导致无法获取 token
  5. **解决方案的原理**：通过手动拉取基础镜像到本地，构建过程就不再需要访问 Docker Hub 的认证服务，因此能够成功完成构建

- **适用场景**：
  - 当你的网络环境可以拉取镜像但无法连接 Docker Hub 认证服务时
  - 当你遇到 "failed to fetch anonymous token" 错误时
  - 当你想完全离线构建项目时（前提是所有基础镜像都已在本地）

- **优势**：
  - 不需要修改网络配置或使用代理
  - 操作简单，只需多执行两步命令
  - 适用于各种网络环境问题

### 9. Docker Desktop 中的数据库与本地数据库的区别

- **问题**：Docker Desktop 里面的数据库与我本地的数据库是同一个吗？

- **答案**：不是，Docker Desktop 里面的数据库与你本地的数据库是完全独立的两个数据库实例。

- **主要区别**：

  1. **运行环境不同**：
     - **本地数据库**：直接安装在你的电脑操作系统上（如 Windows 或 Mac），作为系统服务运行
     - **Docker 数据库**：运行在 Docker 容器中，是一个隔离的虚拟环境

  2. **存储位置不同**：
     - **本地数据库**：数据存储在你电脑的文件系统中（如 `C:\ProgramData\MySQL`）
     - **Docker 数据库**：数据默认存储在容器的虚拟文件系统中，或通过卷挂载到主机的特定位置

  3. **网络访问不同**：
     - **本地数据库**：通过 `localhost:3306` 访问（使用默认端口）
     - **Docker 数据库**：
       - 在容器内部通过 `localhost:3306` 访问
       - 从主机访问需要通过映射的端口，如 `localhost:3307`（根据配置）

  4. **配置和数据隔离**：
     - 两者的配置文件、用户数据、数据库表结构都是完全独立的
     - 在一个数据库中创建的表和数据不会影响另一个数据库

  5. **管理方式不同**：
     - **本地数据库**：通过系统服务管理（如 Windows 服务）或 MySQL 管理工具
     - **Docker 数据库**：通过 Docker 命令或 Docker Desktop 界面管理

- **为什么这样设计**：
  Docker 的核心优势就是提供隔离的运行环境，确保应用在不同环境中表现一致，同时避免不同服务之间的相互影响。

- **注意事项**：
  如果你想在 Docker 容器和本地环境中使用相同的数据库，需要进行额外的配置，比如将本地数据库的存储目录挂载到 Docker 容器中，但这通常不是推荐的做法，因为会失去容器化的隔离优势。

### 10. Docker 镜像的在本地存储位置

- **问题**：我使用的是 Windows 电脑，在 `ProgramData` 文件夹下找不到 `Docker` 文件夹，Docker 镜像到底存储在哪里？

- **答案**：这是因为你使用的是 WSL 2 后端的 Docker Desktop，镜像存储在 WSL 2 虚拟机的文件系统中，而不是直接存储在 Windows 文件系统中。

- **不同环境下的存储位置**：

  1. **Windows 系统**：
     - **使用 WSL 2 后端**（现代 Docker Desktop 的默认配置）：
       - 镜像存储在 WSL 2 虚拟机中
       - 访问路径：`\\wsl$\docker-desktop-data\version-pack-data\community\docker\`
       - 具体来说，镜像文件存储在 `image` 子目录中
     - **使用 Hyper-V 后端**（旧版 Docker Desktop）：
       - 镜像存储在 `C:\ProgramData\Docker\windowsfilter`（Windows 容器）

  2. **Mac 系统**：
     - 镜像存储在虚拟磁盘文件中
     - 路径：`~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw`

  3. **Linux 系统**：
     - 镜像存储在本地文件系统中
     - 路径：`/var/lib/docker/image/`

- **如何查看和管理本地镜像**：

  1. **使用 Docker 命令**（推荐）：
     - `docker images`：列出所有本地镜像
     - `docker image ls`：与 `docker images` 功能相同
     - `docker image inspect <镜像ID>`：查看镜像的详细信息
     - `docker rmi <镜像ID>`：删除不需要的镜像
     - `docker system prune -a`：清理所有未使用的镜像和容器

  2. **使用 Docker Desktop**：
     - 打开 Docker Desktop
     - 点击 "Images" 标签页
     - 你可以在这里看到所有本地镜像，并进行管理操作

  3. **通过 WSL 访问**：
     - 在文件资源管理器的地址栏中输入 `\\wsl$\docker-desktop-data`
     - 导航到 `version-pack-data\community\docker\image` 目录
     - 注意：这里的文件结构非常复杂，不建议手动修改

- **Docker 镜像的存储原理**：
  - Docker 镜像采用分层存储结构
  - 每个镜像由多个只读层组成
  - 当你运行容器时，Docker 会在镜像上层添加一个可写层
  - 这种分层结构使得镜像可以高效地共享和重用

- **为什么找不到镜像文件**：
  - 在 WSL 2 后端下，镜像是以分层的方式存储在 WSL 2 虚拟机的虚拟文件系统中
  - 这些文件不是以传统的文件形式存储，而是采用了特殊的存储格式
  - Docker 设计的初衷就是为了屏蔽底层存储的复杂性，让用户能够更专注于应用的开发和部署

- **总结**：
  虽然你无法在 Windows 文件系统中直接找到 Docker 镜像文件，但你可以通过 Docker 命令或 Docker Desktop 界面轻松管理这些镜像。使用 `docker images` 命令是查看和管理本地镜像的最简单和最安全的方法。



## 七、Docker 镜像存储与分发

### 本地构建与使用
- **本地构建**：执行 `docker-compose up -d --build` 时，Docker 会在本地构建镜像，存储在本地 Docker 引擎中
- **直接使用**：本地构建的镜像可以直接在本地使用，**不需要**先上传到 Docker Hub
- **本地存储**：镜像存储在本地 Docker 引擎的镜像仓库中，可通过 `docker images` 查看

### Docker Hub 的作用
- **远程仓库**：Docker Hub 是一个公共的 Docker 镜像仓库，用于存储和分享镜像
- **上传镜像**：当你需要在其他机器上使用你的镜像时，可以上传到 Docker Hub
- **下载镜像**：可以从 Docker Hub 下载其他人分享的镜像，如 `mysql:8.0`

### 重要说明：上传前必须先构建镜像
在上传镜像到 Docker Hub 之前，**必须**先将项目构建成 Docker 镜像。构建过程会将你的项目代码、依赖和配置打包成一个完整的镜像文件，然后才能上传到远程仓库。

### 上传镜像到 Docker Hub（可选）
1. 登录 Docker Hub：
   ```bash
   docker login
   ```
2. 为镜像添加标签：
   ```bash
   docker tag <本地镜像名> <你的Docker Hub用户名>/<镜像名>:<标签>
   ```
3. 上传镜像：
   ```bash
   docker push <你的Docker Hub用户名>/<镜像名>:<标签>
   ```

### 从 Docker Hub 拉取镜像
- 当你执行 `docker pull mysql:8.0` 时，Docker 会从 Docker Hub 下载镜像到本地
- `docker-compose up` 时，会自动拉取配置文件中指定的镜像

## 八、镜像运行流程对比

### 流程一：直接运行本地镜像（无需上传 Docker Hub）

**适用场景**：仅在本地开发和测试时使用

**步骤**：
1. **构建镜像**：
   ```bash
   docker-compose up -d --build
   ```

2. **查看和管理**：
   - 在 Docker Desktop 的 "Images" 标签页查看本地镜像
   - 在 "Containers" 标签页查看运行的容器

3. **停止服务**：
   ```bash
   docker-compose down
   ```

**优势**：
- 无需网络连接到 Docker Hub
- 启动速度快，因为不需要下载镜像
- 隐私保护，敏感项目可以只在本地运行

### 流程二：上传到 Docker Hub 后拉取运行

**适用场景**：在多台机器上使用同一个镜像，或与团队成员共享

**步骤**：
1. **本地构建镜像**：
   ```bash
   docker-compose up -d --build
   ```

2. **上传镜像到 Docker Hub**：
   ```bash
   # 登录 Docker Hub
   docker login
   
   # 为镜像添加标签
   docker tag <本地镜像名> <你的Docker Hub用户名>/<镜像名>:<标签>
   
   # 上传镜像
   docker push <你的Docker Hub用户名>/<镜像名>:<标签>
   ```

3. **从 Docker Hub 拉取并运行**：
   ```bash
   # 拉取镜像
   docker pull <你的Docker Hub用户名>/<镜像名>:<标签>
   
   # 运行镜像
   docker run -d -p 3000:3000 <你的Docker Hub用户名>/<镜像名>:<标签>
   ```

   **或使用 docker-compose 拉取**：
   修改 `docker-compose.yml` 文件，将 `build: .` 改为 `image: <你的Docker Hub用户名>/<镜像名>:<标签>`，然后执行：
   ```bash
   docker-compose up -d
   ```

**优势**：
- 可以在任何安装了 Docker 的机器上使用
- 便于团队协作和镜像版本管理
- 适合生产环境部署

## 九、总结

通过本教程，你已成功：

1. 了解了项目的 Docker 配置文件结构
2. 构建了包含前端和后端的 Docker 镜像
3. 在 Docker 中运行了完整的应用（包括数据库）
4. 验证了服务的正常运行
5. 理解了 Docker 镜像的存储和分发流程
6. 掌握了两种镜像运行流程：
   - 直接运行本地镜像（无需上传 Docker Hub）
   - 上传到 Docker Hub 后拉取运行

现在，你的项目已容器化，你可以根据具体需求选择合适的运行流程：
- **本地开发测试**：选择直接运行本地镜像，速度快且无需网络
- **多机器部署或团队共享**：选择上传到 Docker Hub 后拉取运行，便于统一管理和分发

无论选择哪种流程，Docker 都为你的应用提供了一致、可移植的运行环境，确保应用在不同环境中表现一致。
