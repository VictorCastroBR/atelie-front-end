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

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, payload)
  return data
}

export const createProduct = async (payload: CreateProductPayload) => {
    const { data } = await api.post('/products', payload)
    return data
}