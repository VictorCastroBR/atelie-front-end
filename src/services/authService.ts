import { api, storage } from './api'

type LoginPayload = { email: string; password: string }
type LoginResponse = {
  access_token: string
  refresh_token: string
  token_type?: string
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  storage.access = data.access_token
  storage.refresh = data.refresh_token
  return data
}

export function logout() {
  storage.access = null
  storage.refresh = null
}
