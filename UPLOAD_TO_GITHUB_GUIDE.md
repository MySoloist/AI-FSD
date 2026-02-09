# 一键上传项目到GitHub脚本使用指南

## 脚本概述

本脚本旨在简化将本地项目上传到GitHub的过程，提供一站式的解决方案，包括初始化Git仓库、创建.gitignore文件、配置Git用户信息、添加远程仓库、提交代码和推送代码等步骤。

## 脚本功能

- ✅ 检查Git是否安装
- ✅ 自动初始化Git仓库（如果未初始化）
- ✅ 自动创建合理的.gitignore文件（如果不存在）
- ✅ 配置Git用户信息（如果未配置）
- ✅ 添加远程GitHub仓库
- ✅ 自动提交代码
- ✅ 推送代码到GitHub
- ✅ 彩色控制台输出，提升用户体验
- ✅ 错误处理和提示

## 系统要求

- **操作系统**：Windows、macOS、Linux
- **Git**：已安装并配置（脚本会自动检查）
- **Node.js**：已安装（用于运行脚本）
- **GitHub账号**：用于创建和访问仓库

## 脚本安装

1. **下载脚本**：将 `upload-to-github.js` 文件保存到本地项目根目录

2. **赋予执行权限**（仅 macOS/Linux 需要）：
   ```bash
   chmod +x upload-to-github.js
   ```

3. **创建配置文件**（可选）：
   - 复制 `github-config.json.example` 文件并重命名为 `github-config.json`
   - 编辑 `github-config.json` 文件，填写你的GitHub信息：
   ```json
   {
     "username": "your-github-username",
     "email": "your-github-email@example.com",
     "repositoryUrl": "https://github.com/your-github-username/your-repository.git"
   }
   ```
   - 保存配置文件后，脚本会自动读取这些信息，无需交互式输入

## 使用方法

### 步骤1：准备GitHub仓库

在使用脚本前，需要先在GitHub上创建一个新的仓库：

1. 登录GitHub账号
2. 点击右上角的 "+", 选择 "New repository"
3. 填写仓库名称、描述等信息
4. 选择仓库类型（公开/私有）
5. 不要勾选 "Initialize this repository with a README" 等选项
6. 点击 "Create repository"
7. 复制生成的仓库URL（例如：`https://github.com/username/repository.git`）

### 步骤2：运行脚本

在项目根目录下运行脚本：

#### Windows系统
```bash
node upload-to-github.js
```

#### macOS/Linux系统
```bash
./upload-to-github.js
# 或
node upload-to-github.js
```

### 步骤3：按照脚本提示操作

脚本会引导你完成以下操作：

1. **读取配置文件**：脚本会自动检查并读取 `github-config.json` 文件中的配置信息
2. **检查Git安装状态**：脚本会自动检查Git是否安装
3. **初始化Git仓库**：如果当前目录不是Git仓库，脚本会自动初始化
4. **创建.gitignore文件**：如果不存在，脚本会创建一个合理的.gitignore文件
5. **配置Git用户信息**：如果未配置且配置文件中提供了信息，会自动配置；否则会提示输入
6. **输入GitHub仓库URL**：如果配置文件中提供了仓库URL，会自动使用；否则会提示输入
7. **提交代码**：脚本会自动添加所有文件并提交
8. **推送代码**：脚本会将代码推送到GitHub仓库

### 示例输出

```
========================================
      一键上传项目到GitHub脚本          
========================================
当前目录已是Git仓库
.gitignore文件已存在，跳过创建
Git用户信息已配置，跳过配置
请输入您的GitHub仓库URL (例如: https://github.com/username/repository.git):
https://github.com/example/test-project.git
添加远程仓库...
添加文件到暂存区...
提交代码...
推送代码到GitHub...
========================================
     项目上传到GitHub成功！             
========================================
仓库地址: https://github.com/example/test-project.git
```

## 脚本工作流程

1. **读取配置**：检查并读取 `github-config.json` 配置文件
2. **检查环境**：确认Git已安装
3. **仓库初始化**：检查并初始化Git仓库
4. **文件配置**：创建.gitignore文件
5. **用户配置**：设置Git用户信息（优先使用配置文件中的信息）
6. **远程配置**：添加GitHub远程仓库（优先使用配置文件中的URL）
7. **代码管理**：添加、提交代码
8. **远程推送**：将代码推送到GitHub
9. **完成提示**：显示成功信息和仓库地址

## .gitignore文件说明

脚本会自动创建一个包含以下内容的.gitignore文件：

- **Node.js依赖**：node_modules/ 等
- **环境变量文件**：.env 等
- **编译产物**：dist/、build/ 等
- **日志文件**：logs、*.log 等
- **操作系统文件**：.DS_Store、Thumbs.db 等
- **IDE文件**：.vscode/、.idea/ 等
- **数据库文件**：*.db、*.sqlite 等
- **测试覆盖率**：coverage/ 等
- **临时文件**：*.tmp、*.temp 等

## 常见问题与解决方案

### 1. Git未安装

**错误信息**：`错误: Git 未安装，请先安装 Git`

**解决方案**：
- 下载并安装Git：https://git-scm.com/downloads
- 安装完成后重新运行脚本

### 2. 仓库URL格式错误

**错误信息**：推送失败

**解决方案**：
- 确保输入的仓库URL格式正确，例如：`https://github.com/username/repository.git`
- 确保仓库已在GitHub上创建

### 3. 权限不足

**错误信息**：`remote: Permission to username/repository.git denied to user`

**解决方案**：
- 确保你有权限访问该GitHub仓库
- 检查Git凭证是否正确
- 可以尝试使用SSH方式连接GitHub

### 4. 分支名称问题

**错误信息**：`error: failed to push some refs to 'https://github.com/...'`

**解决方案**：
- 脚本默认使用 `main` 分支
- 确保GitHub仓库的默认分支也是 `main`
- 或者在GitHub上创建仓库时选择与本地一致的分支名称

## 注意事项

1. **脚本位置**：请确保在项目根目录运行脚本
2. **仓库准备**：使用脚本前请先在GitHub上创建仓库
3. **网络连接**：确保网络连接正常，能够访问GitHub
4. **Git凭证**：第一次推送时可能需要输入GitHub账号密码或SSH密钥
5. **文件大小**：如果项目包含大文件，可能需要使用Git LFS
6. **隐私保护**：确保没有将敏感信息（如API密钥、密码等）提交到仓库

## 高级用法

### 自定义提交信息

如果需要自定义提交信息，可以修改脚本中的 `commitCode` 函数：

```javascript
function commitCode() {
  logWithColor('添加文件到暂存区...', 'blue');
  runCommand('git add .');
  
  logWithColor('提交代码...', 'blue');
  // 修改这里的提交信息
  runCommand('git commit -m "自定义提交信息"');
  logWithColor('代码提交成功', 'green');
}
```

### 自定义分支名称

如果需要使用非 `main` 的分支名称，可以修改脚本中的 `pushToGitHub` 函数：

```javascript
function pushToGitHub() {
  logWithColor('推送代码到GitHub...', 'blue');
  // 修改这里的分支名称
  runCommand('git push -u origin 自定义分支名');
  logWithColor('代码推送成功', 'green');
}
```

## 脚本源码结构

```javascript
├── upload-to-github.js
│   ├── 颜色输出函数
│   ├── 命令执行函数
│   ├── Git检查函数
│   ├── 仓库初始化函数
│   ├── .gitignore创建函数
│   ├── 用户配置函数
│   ├── 代码提交函数
│   ├── 推送函数
│   └── 主函数
```

## 故障排除

如果遇到其他问题，可以尝试以下步骤：

1. **检查Git状态**：
   ```bash
   git status
   ```

2. **检查远程仓库**：
   ```bash
   git remote -v
   ```

3. **手动推送**：
   ```bash
   git push -u origin main
   ```

4. **查看Git日志**：
   ```bash
   git log
   ```

## 总结

本脚本提供了一种简单、高效的方式将本地项目上传到GitHub，适合初学者和需要快速部署项目的开发者使用。脚本会自动处理大部分繁琐的Git操作，让你专注于项目开发本身。

---

**提示**：上传完成后，你可以在GitHub仓库页面查看你的项目，并开始使用GitHub的各种功能，如Issues、Pull Requests、Actions等。