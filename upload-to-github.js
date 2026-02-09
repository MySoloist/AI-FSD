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
    const remoteOutput = execSync('git remote -v', { encoding: 'utf8' });
    if (remoteOutput.includes('origin')) {
      logWithColor('远程仓库 origin 已存在，检查 URL...', 'yellow');
      // 检查现有远程仓库 URL 是否正确
      const existingUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      if (existingUrl !== remoteUrl) {
        logWithColor(`现有 URL: ${existingUrl}`, 'yellow');
        logWithColor(`期望 URL: ${remoteUrl}`, 'yellow');
        logWithColor('更新远程仓库 URL...', 'blue');
        runCommand(`git remote set-url origin ${remoteUrl}`);
        logWithColor('远程仓库 URL 更新成功', 'green');
      } else {
        logWithColor('远程仓库 URL 正确，跳过更新', 'yellow');
      }
    } else {
      logWithColor('添加远程仓库...', 'blue');
      runCommand(`git remote add origin ${remoteUrl}`);
      logWithColor('远程仓库添加成功', 'green');
    }
  } catch (error) {
    logWithColor('添加远程仓库失败，尝试重新添加...', 'red');
    // 尝试移除并重新添加
    try {
      execSync('git remote remove origin', { encoding: 'utf8' });
    } catch (e) {
      // 忽略移除失败的错误
    }
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
  
  // 检查是否有文件被暂存
  try {
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!statusOutput.trim()) {
      logWithColor('没有文件需要提交，跳过提交', 'yellow');
      return;
    }
  } catch (error) {
    logWithColor('检查暂存状态失败，继续尝试提交', 'yellow');
  }
  
  logWithColor('提交代码...', 'blue');
  try {
    runCommand('git commit -m "Initial commit"');
    logWithColor('代码提交成功', 'green');
  } catch (error) {
    logWithColor('提交失败，尝试配置用户信息后重新提交...', 'red');
    // 检查并配置用户信息
    try {
      const config = readConfig();
      if (config && config.username && config.email) {
        runCommand(`git config user.name "${config.username}"`);
        runCommand(`git config user.email "${config.email}"`);
        logWithColor('已配置用户信息，重新尝试提交...', 'blue');
        runCommand('git commit -m "Initial commit"');
        logWithColor('代码提交成功', 'green');
      } else {
        throw new Error('缺少用户信息配置');
      }
    } catch (e) {
      logWithColor('提交失败，请手动配置用户信息并提交', 'red');
      logWithColor('建议执行以下命令：', 'yellow');
      logWithColor('  git config user.name "Your GitHub Username"', 'yellow');
      logWithColor('  git config user.email "your-github-email@example.com"', 'yellow');
      logWithColor('  git commit -m "Initial commit"', 'yellow');
      throw e;
    }
  }
}

// 推送代码到GitHub
function pushToGitHub() {
  logWithColor('推送代码到GitHub...', 'blue');
  try {
    // 获取当前分支名称
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    logWithColor(`当前分支: ${currentBranch}`, 'yellow');
    
    // 尝试推送当前分支到远程
    try {
      runCommand(`git push -u origin ${currentBranch}`);
      logWithColor('代码推送成功', 'green');
    } catch (error) {
      // 如果失败，尝试推送master分支
      logWithColor('推送当前分支失败，尝试使用master分支...', 'yellow');
      try {
        runCommand('git push -u origin master');
        logWithColor('代码推送成功', 'green');
      } catch (masterError) {
        // 如果仍然失败，尝试创建并推送main分支
        logWithColor('推送master分支失败，尝试使用main分支...', 'yellow');
        try {
          runCommand('git checkout -b main');
          runCommand('git push -u origin main');
          logWithColor('代码推送成功', 'green');
        } catch (mainError) {
          logWithColor('推送失败，请检查以下问题：', 'red');
          logWithColor('1. GitHub仓库是否已创建', 'yellow');
          logWithColor('2. 仓库URL是否正确', 'yellow');
          logWithColor('3. 网络连接是否正常', 'yellow');
          logWithColor('4. 是否有推送权限', 'yellow');
          logWithColor('5. Git凭证是否正确', 'yellow');
          logWithColor('\n建议手动执行以下命令检查：', 'yellow');
          logWithColor('  git remote -v', 'yellow');
          logWithColor('  git status', 'yellow');
          logWithColor('  git push -u origin ' + currentBranch, 'yellow');
          throw mainError;
        }
      }
    }
  } catch (error) {
    logWithColor('推送代码失败', 'red');
    throw error;
  }
}

// 主函数
async function main() {
  logWithColor('========================================', 'blue');
  logWithColor('      一键上传项目到GitHub脚本          ', 'blue');
  logWithColor('========================================', 'blue');
  
  try {
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
    
    // 验证仓库URL格式
    if (!remoteUrl.startsWith('https://github.com/') && !remoteUrl.startsWith('git@github.com:')) {
      logWithColor('警告: 仓库URL格式可能不正确', 'yellow');
      logWithColor('建议格式: https://github.com/username/repository.git', 'yellow');
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
    logWithColor('\n提示: 上传完成后，您可以在GitHub上查看和管理您的项目', 'yellow');
    
  } catch (error) {
    logWithColor('========================================', 'red');
    logWithColor('       脚本执行失败，请检查错误信息       ', 'red');
    logWithColor('========================================', 'red');
    logWithColor(`错误信息: ${error.message}`, 'red');
    logWithColor('\n请尝试以下解决方法:', 'yellow');
    logWithColor('1. 检查GitHub仓库是否已创建', 'yellow');
    logWithColor('2. 确认仓库URL格式正确', 'yellow');
    logWithColor('3. 检查网络连接是否正常', 'yellow');
    logWithColor('4. 确认您有仓库的推送权限', 'yellow');
    logWithColor('5. 检查Git凭证是否正确配置', 'yellow');
  } finally {
    // 关闭readline接口
    rl.close();
  }
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