import { ref, watch } from 'vue'

type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

const cart = ref<CartItem[]>([])

const loadCart = () => {
  const stored = localStorage.getItem('cart')
  if (stored) cart.value = JSON.parse(stored)
}

loadCart()

watch(cart, (val) => {
  localStorage.setItem('cart', JSON.stringify(val))
}, { deep: true })

export function useCart() {
  const addToCart = (product: { id: string, name: string, price: number, images?: any[] }) => {
    const existing = cart.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
        quantity: 1,
      })
    }
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter(item => item.id !== productId)
  }

  const clearCart = () => cart.value = []

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  }
}
