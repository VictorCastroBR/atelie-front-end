<template>
  <v-container fluid class="pa-4">
    <v-card class="mb-6 py-6 px-4 text-center">
      <v-avatar size="100" class="mx-auto mb-3">
        <v-img src="https://img.freepik.com/vetores-gratis/vetor-de-gradiente-de-logotipo-colorido-de-passaro_343694-1365.jpg" alt="Logo da Loja" />
      </v-avatar>
      <h2 class="text-h5 font-weight-bold">Loja de Enxovais do Seu José</h2>
      <div class="text-body-2 mt-1">Rua das Camas, 123 - Centro, Cidade - UF</div>
    </v-card>

    <v-text-field
      v-model="search"
      label="Buscar produtos..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-6"
    />

    <v-row>
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RouterLink :to="`/catalogo/produto/${product.id}`" class="text-decoration-none">
          <v-card class="h-100 d-flex flex-column">
            <v-img
              :src="product.images[0]?.url || placeholder"
              height="200"
              cover
            />

            <v-card-item>
              <div class="text-subtitle-1 font-weight-bold">{{ product.name }}</div>
              <div class="text-body-2 text-grey">{{ product.description }}</div>
              <div class="text-body-1 font-weight-bold mt-2">R$ {{ product.price.toFixed(2) }}</div>
            </v-card-item>
          </v-card>
        </RouterLink>
      </v-col>
    </v-row>

    <v-alert
      v-if="!loading && !filteredProducts.length"
      type="info"
      class="mt-6"
    >
      Nenhum produto encontrado
    </v-alert>

    <v-skeleton-loader v-if="loading" type="card, card, card" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { listProducts } from '@/services/productService'
import type { Product } from '@/services/productService'

const products = ref<Product[]>([])
const loading = ref(false)
const search = ref('')
const placeholder = '/placeholder.png'

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  loading.value = true
  try {
    products.value = await listProducts()
  } catch (err) {
    console.error('Erro ao carregar produtos')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-grey {
  color: #6b7280;
}
.text-decoration-none {
  text-decoration: none;
  color: inherit;
}
</style>
