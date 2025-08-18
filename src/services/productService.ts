import { api } from './api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
}

export interface CreateProductPayload {
    name: string
    description: string
    price: number
    stock: number
    images: string[]
}

export const listProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products')
  return data
}

export const createProduct = async (payload: CreateProductPayload) => {
    const { data } = await api.post('/products', payload)
    return data
}