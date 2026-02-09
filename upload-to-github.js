#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 读取用户输入的函数
function readInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 颜色输出函数
function logWithColor(text, color) {
  const colors = {
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color]}${text}${colors.reset}`);
}

// 执行命令并显示输出
function runCommand(cmd, cwd = process.cwd()) {
  try {
    const output = execSync(cmd, { cwd, encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    logWithColor(`命令执行失败: ${cmd}`, 'red');
    logWithColor(`错误信息: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 检查Git是否安装
function checkGitInstalled() {
  try {
    execSync('git --version', { encoding: 'utf8' });
    return true;
  } catch (error) {
    logWithColor('错误: Git 未安装，请先安装 Git', 'red');
    logWithColor('下载地址: https://git-scm.com/downloads', 'yellow');
    process.exit(1);
  }
}

// 检查是否在Git仓库中
function isGitRepository() {
  return fs.existsSync(path.join(process.cwd(), '.git'));
}

// 初始化Git仓库
function initGitRepository() {
  logWithColor('初始化Git仓库...', 'blue');
  runCommand('git init');
  logWithColor('Git仓库初始化成功', 'green');
}

// 创建.gitignore文件（如果不存在）
function createGitignore() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    logWithColor('创建.gitignore文件...', 'blue');
    const gitignoreContent = `# Node.js 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# 环境变量文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 编译产物
dist/
build/
out/

# 日志文件
logs
*.log

# 操作系统文件
.DS_Store
Thumbs.db

# IDE 文件
.vscode/
.idea/
*.swp
*.swo
*~

# 数据库文件
*.db
*.sqlite
*.sqlite3

# 测试覆盖率
coverage/
*.lcov

# 临时文件
*.tmp
*.temp
.cache/`;
    fs.writeFileSync(gitignorePath, gitignoreContent);
    logWithColor('.gitignore文件创建成功', 'green');
  } else {
    logWithColor('.gitignore文件已存在，跳过创建', 'yellow');
  }
}

// 添加远程仓库
function addRemoteRepository(remoteUrl) {
  try {
    // 检查远程仓库是否已存在
    execSync('git remote -v', { encoding: 'utf8' });
    logWithColor('远程仓库已存在，跳过添加', 'yellow');
  } catch (error) {
    logWithColor('添加远程仓库...', 'blue');
    runCommand(`git remote add origin ${remoteUrl}`);
    logWithColor('远程仓库添加成功', 'green');
  }
}

// 读取配置文件
function readConfig() {
  const configPath = path.join(process.cwd(), 'github-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      logWithColor('读取配置文件成功', 'green');
      return config;
    } catch (error) {
      logWithColor('配置文件格式错误，将使用交互式输入', 'yellow');
      return null;
    }
  }
  return null;
}

// 配置Git用户信息
async function configureGitUser(config) {
  try {
    // 检查是否已配置用户信息
    execSync('git config user.name', { encoding: 'utf8' });
    execSync('git config user.email', { encoding: 'utf8' });
    logWithColor('Git用户信息已配置，跳过配置', 'yellow');
  } catch (error) {
    logWithColor('配置Git用户信息...', 'blue');
    
    let username, email;
    
    if (config && config.username && config.email) {
      username = config.username;
      email = config.email;
      logWithColor(`使用配置文件中的用户信息: ${username} <${email}>`, 'green');
    } else {
      logWithColor('请输入您的GitHub用户名:', 'yellow');
      username = await readInput('');
      logWithColor('请输入您的GitHub邮箱:', 'yellow');
      email = await readInput('');
    }
    
    runCommand(`git config user.name "${username}"`);
    runCommand(`git config user.email "${email}"`);
    logWithColor('Git用户信息配置成功', 'green');
  }
}

// 提交代码
function commitCode() {
  logWithColor('添加文件到暂存区...', 'blue');
  runCommand('git add .');
  
  logWithColor('提交代码...', 'blue');
  runCommand('git commit -m "Initial commit"');
  logWithColor('代码提交成功', 'green');
}

// 推送代码到GitHub
function pushToGitHub() {
  logWithColor('推送代码到GitHub...', 'blue');
  try {
    // 尝试推送当前分支到远程
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    runCommand(`git push -u origin ${currentBranch}`);
  } catch (error) {
    // 如果失败，尝试推送master分支
    logWithColor('尝试使用master分支推送...', 'yellow');
    runCommand('git push -u origin master');
  }
  logWithColor('代码推送成功', 'green');
}

// 主函数
async function main() {
  logWithColor('========================================', 'blue');
  logWithColor('      一键上传项目到GitHub脚本          ', 'blue');
  logWithColor('========================================', 'blue');
  
  // 读取配置文件
  const config = readConfig();
  
  // 检查Git是否安装
  checkGitInstalled();
  
  // 检查是否在Git仓库中
  if (!isGitRepository()) {
    initGitRepository();
  } else {
    logWithColor('当前目录已是Git仓库', 'yellow');
  }
  
  // 创建.gitignore文件
  createGitignore();
  
  // 配置Git用户信息
  await configureGitUser(config);
  
  // 获取GitHub仓库URL
  let remoteUrl;
  if (config && config.repositoryUrl) {
    remoteUrl = config.repositoryUrl;
    logWithColor(`使用配置文件中的仓库URL: ${remoteUrl}`, 'green');
  } else {
    logWithColor('请输入您的GitHub仓库URL (例如: https://github.com/username/repository.git):', 'yellow');
    remoteUrl = await readInput('');
  }
  
  if (!remoteUrl) {
    logWithColor('错误: 仓库URL不能为空', 'red');
    rl.close();
    process.exit(1);
  }
  
  // 添加远程仓库
  addRemoteRepository(remoteUrl);
  
  // 提交代码
  commitCode();
  
  // 推送代码到GitHub
  pushToGitHub();
  
  logWithColor('========================================', 'green');
  logWithColor('     项目上传到GitHub成功！             ', 'green');
  logWithColor('========================================', 'green');
  logWithColor(`仓库地址: ${remoteUrl}`, 'green');
  
  // 关闭readline接口
  rl.close();
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    logWithColor(`脚本执行失败: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
  });
}

module.exports = {
  main
};