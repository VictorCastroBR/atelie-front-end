import { api } from './api'

export interface Store {
  id: string
  name: string
  cnpj: string
  phone_number: string
  is_open: boolean
  img: {
    url: string
    public_url: string
  } | null
  address: {
    street: string
    number: number
    district: string
    city: string
    state: string
  }
}

export type StoreUpdatePayload = Omit<Store, 'id'>

export const getStore = async (): Promise<Store> => {
  const { data } = await api.get('/store')
  return data
}

export const updateStore = async (id: string, payload: StoreUpdatePayload): Promise<Store> => {
  const { data } = await api.put(`/store/${id}`, payload)
  return data
}

export const uploadStoreImage = async (id: string, formData: FormData): Promise<void> => {
  await api.post(`/store/upload-image/${id}`, formData)
}
