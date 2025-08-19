<template>
  <v-container class="pa-4" fluid>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">
          Voltar
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="product">
      <v-col cols="12" md="6">
        <v-carousel v-if="product.images?.length" height="300">
          <v-carousel-item
            v-for="(image, i) in product.images"
            :key="i"
            :src="image.url"
            cover
          ></v-carousel-item>
        </v-carousel>
        <v-img
          v-else
          src=""
          height="300"
          cover
        ></v-img>
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold">{{ product.name }}</h2>
        <p class="text-grey text-body-1">{{ product.description }}</p>

        <p class="text-h6 font-weight-medium mt-3">R$ {{ product.price.toFixed(2) }}</p>

        <p class="text-caption mt-1">Estoque: {{ product.stock }}</p>

        <v-btn color="primary" block height="45" @click="addToCart(product)">
            Adicionar ao Carrinho
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { useCart } from '@/composables/useCart'

const route = useRoute()
const product = ref<any>(null)
const { addToCart } = useCart()

onMounted(async () => {
  try {
    const { data } = await api.get(`/products/${route.params.id}`)
    product.value = data
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
  }
})
</script>