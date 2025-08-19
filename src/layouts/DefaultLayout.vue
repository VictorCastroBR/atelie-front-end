<template>
  <v-main>
    <v-container fluid>
      <RouterView />
    </v-container>
  </v-main>
  <v-bottom-navigation
    app
    class="d-sm-none"
    height="60"
    grow
  >
    <v-btn to="/catalogo" icon>
      <v-icon>mdi-store</v-icon>
    </v-btn>

    <v-btn to="/carrinho" icon>
      <v-badge :content="cart.length" v-if="cart.length" color="red" overlap>
        <v-icon>mdi-cart</v-icon>
      </v-badge>
      <template v-else>
        <v-icon>mdi-cart</v-icon>
      </template>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart'
const { cart } = useCart()
</script>
