import { api } from './api'

export async function uploadProductImage(productId: string, file: File) {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post(`/products/upload-image/${productId}`, form)
    return data
}

export async function deleteProductImage(productId: string, publicId: string) {
  await api.delete(`/products/delete-image/${productId}/${publicId}`)
}