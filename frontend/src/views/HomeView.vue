<template>
  <div class="home">
    <h1>用户管理系统</h1>
    <p>欢迎使用用户管理系统</p>
    <div class="action-buttons">
      <button @click="getUsers" class="btn-primary">获取用户列表</button>
      <router-link to="/users/create" class="btn-success">创建用户</router-link>
    </div>
    <!-- 获取指定用户数据功能 -->
    <div class="user-search">
      <h3>获取指定用户数据</h3>
      <div class="search-form">
        <input 
          type="number" 
          v-model="userId" 
          placeholder="请输入用户ID"
          min="1"
        >
        <button @click="getUserById" class="btn-info">获取用户</button>
      </div>
      <div v-if="selectedUser" class="user-detail-card">
        <h4>用户详情</h4>
        <div class="detail-item">
          <span>ID: {{ selectedUser.id }}</span>
        </div>
        <div class="detail-item">
          <span>姓名: {{ selectedUser.name }}</span>
        </div>
        <div class="detail-item">
          <span>邮箱: {{ selectedUser.email }}</span>
        </div>
        <div class="detail-item">
          <span>创建时间: {{ formatDate(selectedUser.created_at) }}</span>
        </div>
        <div class="card-actions">
          <router-link :to="`/users/${selectedUser.id}/edit`" class="btn-warning">编辑</router-link>
          <button @click="clearSelectedUser" class="btn-secondary">清空</button>
        </div>
      </div>
    </div>
    <div v-if="users.length > 0">
      <h2>用户列表</h2>
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td class="action-buttons">
              <router-link :to="`/users/${user.id}`" class="btn-info">详情</router-link>
              <router-link :to="`/users/${user.id}/edit`" class="btn-warning">编辑</router-link>
              <button @click="deleteUser(user.id)" class="btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!error" class="empty-state">
      <p>暂无用户数据，请点击"获取用户列表"按钮加载数据</p>
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const users = ref([])
    const error = ref('')
    const userId = ref('')
    const selectedUser = ref(null)

    const getUsers = async () => {
      try {
        const response = await axios.get('/api/users')
        users.value = response.data.data
        error.value = ''
      } catch (err) {
        error.value = '获取用户列表失败，请稍后重试'
        users.value = [] // 确保 users 是数组，避免渲染错误
        console.error(err)
      }
    }

    const deleteUser = async (id) => {
      if (confirm('确定要删除这个用户吗？')) {
        try {
          await axios.delete(`/api/users/${id}`)
          // 重新加载用户列表
          getUsers()
        } catch (err) {
          error.value = '删除用户失败'
          console.error(err)
        }
      }
    }

    // 获取指定用户数据
    const getUserById = async () => {
      if (!userId.value) {
        error.value = '请输入用户ID'
        return
      }

      try {
        error.value = ''
        const response = await axios.get(`/api/users/${userId.value}`)
        selectedUser.value = response.data.data
      } catch (err) {
        error.value = '获取用户数据失败，请检查用户ID是否正确'
        selectedUser.value = null
        console.error(err)
      }
    }

    // 清空选中的用户数据
    const clearSelectedUser = () => {
      selectedUser.value = null
      userId.value = ''
      error.value = ''
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }

    // 组件挂载时自动获取用户列表
    onMounted(() => {
      getUsers()
    })

    return {
      users,
      error,
      userId,
      selectedUser,
      getUsers,
      deleteUser,
      getUserById,
      clearSelectedUser,
      formatDate
    }
  }
}
</script>

<style>
.home {
  text-align: center;
}

.home h1 {
  color: #35495e;
  margin-bottom: 10px;
  font-size: 2rem;
}

.home p {
  color: #666;
  margin-bottom: 20px;
}

/* 错误提示 */
.error {
  color: red;
  margin: 10px 0;
  padding: 12px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
}

/* 空状态 */
.empty-state {
  margin: 30px 0;
  padding: 50px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
  color: #666;
}

/* 操作按钮区域 */
.action-buttons {
  margin: 20px 0;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

/* 获取指定用户数据功能样式 */
.user-search {
  margin: 30px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 25px;
  text-align: left;
}

.user-search h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #35495e;
  font-size: 1.2rem;
}

.search-form {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.search-form input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-form input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

/* 用户详情卡片 */
.user-detail-card {
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.user-detail-card h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #35495e;
  font-size: 1rem;
}

.detail-item {
  margin: 8px 0;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #42b983;
}

.card-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

/* 按钮样式 */
.btn-primary, .btn-success, .btn-info, .btn-warning, .btn-danger, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-success {
  background-color: #2ecc71;
  color: white;
}

.btn-info {
  background-color: #3498db;
  color: white;
}

.btn-warning {
  background-color: #f39c12;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-primary:hover {
  background-color: #35495e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-success:hover {
  background-color: #27ae60;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-info:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-warning:hover {
  background-color: #e67e22;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-danger:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 用户表格 */
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.user-table th, .user-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.user-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #35495e;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-table tr {
  transition: background-color 0.3s ease;
}

.user-table tr:hover {
  background-color: #f8f9fa;
}

.user-table tr:last-child td {
  border-bottom: none;
}

/* 表格中的操作按钮 */
.user-table .action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin: 0;
}

.user-table .action-buttons .btn-info, 
.user-table .action-buttons .btn-warning, 
.user-table .action-buttons .btn-danger {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons .btn {
    text-align: center;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .user-table {
    font-size: 14px;
  }
  
  .user-table th, .user-table td {
    padding: 10px;
  }
  
  .user-table .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
}
</style>