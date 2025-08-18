<template>
  <v-container class="pa-4" fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h6 font-weight-bold">Produtos</h2>
      <v-btn color="primary" @click="router.push('/admin/produtos/novo')">
        Novo Produto
      </v-btn>
    </div>

    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
      border="start"
      variant="tonal"
    >
      {{ error }}
    </v-alert>

    <v-row v-if="!loading">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-item>
            <v-card-title class="text-h6">{{ product.name }}</v-card-title>
            <v-card-subtitle>R$ {{ product.price.toFixed(2) }}</v-card-subtitle>
          </v-card-item>

          <v-card-text class="text-truncate">
            {{ product.description }}
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <v-chip color="grey-lighten-2" variant="flat" size="small">
              Estoque: {{ product.stock }}
            </v-chip>

            <v-btn icon @click="editProduct(product.id)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-skeleton-loader
      v-if="loading"
      type="card"
      class="mx-auto"
      :loading="true"
      max-width="400"
    ></v-skeleton-loader>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listProducts } from '@/services/productService'
import type { Product } from '@/services/productService'

const router = useRouter()
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    products.value = await listProducts()
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao carregar produtos'
  } finally {
    loading.value = false
  }
})

const editProduct = (id: string) => {
  router.push(`/admin/produtos/${id}/editar`)
}
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
