import axios from 'axios'

const userApi = {
  // 获取所有用户
  getUsers: async () => {
    const response = await axios.get('/api/users')
    return response.data
  },
  
  // 获取单个用户
  getUser: async (id) => {
    const response = await axios.get(`/api/users/${id}`)
    return response.data
  },
  
  // 创建用户
  createUser: async (userData) => {
    const response = await axios.post('/api/users', userData)
    return response.data
  },
  
  // 更新用户
  updateUser: async (id, userData) => {
    const response = await axios.put(`/api/users/${id}`, userData)
    return response.data
  },
  
  // 删除用户
  deleteUser: async (id) => {
    const response = await axios.delete(`/api/users/${id}`)
    return response.data
  }
}

export default userApi