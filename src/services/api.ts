import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

const storage = {
  get access()  { return localStorage.getItem('access_token') },
  set access(v) { v ? localStorage.setItem('access_token', v) : localStorage.removeItem('access_token') },
  
  get refresh()  { return localStorage.getItem('refresh_token') },
  set refresh(v) { v ? localStorage.setItem('refresh_token', v) : localStorage.removeItem('refresh_token') },

  get role()  { return localStorage.getItem('role') },
  set role(v) { v ? localStorage.setItem('role', v) : localStorage.removeItem('role') },
}

let isRefreshing = false
let queue: Array<(t: string)=>void> = []

api.interceptors.request.use((config) => {
    const token = storage.access
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status === 401 && !original._retry && storage.refresh) {
      original._retry = true

      if (isRefreshing) {
        // aguarda refresh em andamento
        return new Promise((resolve) => {
          queue.push((newToken: string) => {
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(api(original))
          })
        })
      }

      try {
        isRefreshing = true
        const newToken = await tryRefresh(storage.refresh)

        storage.access = newToken
        isRefreshing = false
        queue.forEach((cb) => cb(newToken))
        queue = []

        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        isRefreshing = false
        queue = []
        storage.access = null
        storage.refresh = null
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export { api, storage }

async function tryRefresh(refreshToken: string): Promise<string> {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken })
    return data.access_token ?? data?.token ?? ''
  } catch {}

  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, refreshToken, {
      headers: { 'Content-Type': 'text/plain' },
    })
    return data.access_token ?? data?.token ?? ''
  } catch {}

  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    return data.access_token ?? data?.token ?? ''
  } catch (err) {
    throw err
  }
}