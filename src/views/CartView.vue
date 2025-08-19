<template>
  <v-container class="pa-4">
    <v-card v-if="cart.length === 0" class="pa-5 text-center">
      <v-icon size="40" color="grey">mdi-cart-off</v-icon>
      <p class="mt-2 text-grey">Seu carrinho está vazio</p>
    </v-card>

    <v-card v-else class="pa-4">
      <v-card-title class="text-h6 font-weight-bold">Seu Carrinho</v-card-title>

      <v-divider class="my-4" />

      <v-list density="compact">
        <v-list-item v-for="item in cart" :key="item.id">
          <v-list-item-avatar size="60">
            <v-img :src="item.image || 'https://via.placeholder.com/60'" cover />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              R$ {{ item.price.toFixed(2) }} x {{ item.quantity }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="decrease(item)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="mx-2">{{ item.quantity }}</span>
            <v-btn icon @click="increase(item)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-btn icon color="red" @click="removeFromCart(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>

      <v-divider class="my-4" />

      <div class="d-flex justify-space-between">
        <strong>Total:</strong>
        <strong>R$ {{ total.toFixed(2) }}</strong>
      </div>

      <v-btn
        block
        color="success"
        class="mt-4"
        height="45"
        @click="sendToWhatsApp"
      >
        Finalizar Pedido no WhatsApp
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { computed } from 'vue'

const { cart, removeFromCart } = useCart()

const total = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
)

function increase(item: any) {
  item.quantity++
}

function decrease(item: any) {
  if (item.quantity > 1) item.quantity--
  else removeFromCart(item.id)
}

function sendToWhatsApp() {
  const msg = cart.value.map(item =>
    `🛍️ ${item.name} - ${item.quantity}x R$ ${item.price.toFixed(2)}`
  ).join('\n')

  const totalText = `\n\n💰 Total: R$ ${total.value.toFixed(2)}`
  const text = encodeURIComponent(`${msg}${totalText}`)

  const phone = ''
  const link = `https://wa.me/${phone}?text=${text}`
  window.open(link, '_blank')
}
</script>
