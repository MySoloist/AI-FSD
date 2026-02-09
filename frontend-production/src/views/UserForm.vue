<template>
  <div class="user-form">
    <h1>{{ isEdit ? '编辑用户' : '创建用户' }}</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">姓名</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required 
          placeholder="请输入姓名"
        >
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required 
          placeholder="请输入邮箱"
        >
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="formData.password" 
          :required="!isEdit" 
          placeholder="请输入密码"
        >
        <small v-if="isEdit">不填写则保持原密码</small>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '提交中...' : (isEdit ? '更新用户' : '创建用户') }}
        </button>
        <router-link to="/" class="btn-secondary">返回列表</router-link>
      </div>
    </form>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'UserForm',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const error = ref('')
    const formData = ref({
      name: '',
      email: '',
      password: ''
    })

    const userId = computed(() => route.params.id)
    const isEdit = computed(() => !!userId.value)

    const submitForm = async () => {
      try {
        loading.value = true
        error.value = ''

        if (isEdit.value) {
          // 更新用户
          const data = { ...formData.value }
          // 如果密码为空，不发送密码字段
          if (!data.password) {
            delete data.password
          }
          await axios.put(`/api/users/${userId.value}`, data)
          alert('更新用户成功')
        } else {
          // 创建用户
          await axios.post('/api/users', formData.value)
          alert('创建用户成功')
        }

        // 跳转到用户列表
        router.push('/')
      } catch (err) {
        error.value = isEdit.value ? '更新用户失败' : '创建用户失败'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const getUserDetail = async () => {
      if (isEdit.value) {
        try {
          const response = await axios.get(`/api/users/${userId.value}`)
          const user = response.data.data
          formData.value = {
            name: user.name,
            email: user.email,
            password: '' // 密码字段为空，需要用户重新输入
          }
        } catch (err) {
          error.value = '获取用户信息失败'
          console.error(err)
        }
      }
    }

    onMounted(() => {
      if (isEdit.value) {
        getUserDetail()
      }
    })

    return {
      formData,
      loading,
      error,
      isEdit,
      submitForm
    }
  }
}
</script>

<style>
.user-form {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
}

.user-form h1 {
  color: #35495e;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.8rem;
}

/* 表单组 */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #35495e;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
  transform: translateY(-1px);
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

/* 表单操作按钮 */
.form-actions {
  margin-top: 35px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 按钮样式 */
.btn-primary, .btn-secondary {
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

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #35495e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  margin: 20px 0;
  padding: 14px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-form {
    padding: 0 15px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    text-align: center;
  }
}
</style>