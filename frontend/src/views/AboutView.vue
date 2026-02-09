<template>
  <div class="about">
    <h1>关于系统</h1>
    <p>本系统是一个简单的用户管理系统，用于学习和测试 API 接口的实现与测试。</p>
    <h2>技术栈</h2>
    <ul>
      <li>前端：Vue.js + Vite</li>
      <li>后端：Node.js + Express</li>
      <li>数据库：MySQL</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

ul {
  list-style: disc;
  padding-left: 20px;
  text-align: left;
}

li {
  margin: 5px 0;
}
</style>