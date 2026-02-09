<template>
  <div class="user-detail">
    <h1>用户详情</h1>
    <div v-if="loading" class="loading">
      加载中...
    </div>
    <div v-else-if="user" class="user-info">
      <div class="info-item">
        <label>ID:</label>
        <span>{{ user.id }}</span>
      </div>
      <div class="info-item">
        <label>姓名:</label>
        <span>{{ user.name }}</span>
      </div>
      <div class="info-item">
        <label>邮箱:</label>
        <span>{{ user.email }}</span>
      </div>
      <div class="info-item">
        <label>密码:</label>
        <span>******</span>
      </div>
      <div class="info-item">
        <label>创建时间:</label>
        <span>{{ formatDate(user.created_at) }}</span>
      </div>
      <div class="action-buttons">
        <router-link :to="`/users/${user.id}/edit`" class="btn-warning">编辑</router-link>
        <button @click="goBack" class="btn-secondary">返回列表</button>
      </div>
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="goBack" class="btn-secondary">返回列表</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'UserDetail',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(true)
    const error = ref('')
    const user = ref(null)

    const userId = route.params.id

    const getUserDetail = async () => {
      try {
        loading.value = true
        error.value = ''
        const response = await axios.get(`/api/users/${userId}`)
        user.value = response.data.data
      } catch (err) {
        error.value = '获取用户详情失败'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }

    const goBack = () => {
      router.push('/')
    }

    onMounted(() => {
      getUserDetail()
    })

    return {
      loading,
      error,
      user,
      formatDate,
      goBack
    }
  }
}
</script>

<style>
.user-detail {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
}

.user-detail h1 {
  color: #35495e;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.8rem;
}

/* 加载状态 */
.loading {
  padding: 60px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin: 30px 0;
  color: #666;
  font-size: 14px;
}

/* 用户信息卡片 */
.user-info {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin: 30px 0;
}

/* 信息项 */
.info-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-item label {
  width: 120px;
  font-weight: 600;
  color: #35495e;
  font-size: 14px;
  padding-top: 10px;
  flex-shrink: 0;
}

.info-item span {
  flex: 1;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  border-left: 3px solid #42b983;
}

/* 操作按钮 */
.action-buttons {
  margin-top: 30px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 按钮样式 */
.btn-warning, .btn-secondary {
  padding: 12px 24px;
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

.btn-warning {
  background-color: #f39c12;
  color: white;
}

.btn-warning:hover {
  background-color: #e67e22;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 错误提示 */
.error {
  color: red;
  margin: 30px 0;
  padding: 15px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
  font-size: 14px;
  text-align: center;
}

.error .btn-secondary {
  margin-top: 15px;
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-detail {
    padding: 0 15px;
  }
  
  .user-info {
    padding: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .info-item label {
    width: 100%;
    padding-top: 0;
    margin-bottom: 5px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    text-align: center;
  }
}
</style>