<template>
  <div id="app">
    <header>
      <div class="container">
        <h1 class="app-title">用户管理系统</h1>
        <nav>
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </nav>
      </div>
    </header>
    <main>
      <div class="container">
        <router-view />
      </div>
    </main>
    <footer>
      <div class="container">
        <p>&copy; 2026 用户管理系统 - 学习和测试 API 接口的实现与测试</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #f5f7fa;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 容器样式 */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
header {
  background: linear-gradient(135deg, #42b983, #35495e);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 600;
}

nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

/* 主内容区域 */
main {
  flex: 1;
  padding: 30px 0;
}

/* 底部样式 */
footer {
  background-color: #35495e;
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-top: auto;
}

footer p {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 通用卡片样式 */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

/* 通用按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  header {
    padding: 15px 0;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  nav {
    gap: 10px;
  }
  
  main {
    padding: 20px 0;
  }
}
</style>