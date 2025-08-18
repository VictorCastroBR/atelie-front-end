// src/pages/admin/ProductFormView.vue

<template>
  <v-container class="pa-4" fluid>
    <v-card max-width="600" class="mx-auto pa-6 elevation-1">
      <v-card-title class="text-h6 font-weight-bold mb-4">
        {{ isEditMode ? 'Editar Produto' : 'Novo Produto' }}
      </v-card-title>

      <v-form @submit.prevent="onSubmit" ref="formRef" validate-on="submit lazy">
        <v-text-field
          v-model="form.name"
          label="Nome do Produto"
          variant="outlined"
          :rules="[rules.required]"
        />

        <v-textarea
          v-model="form.description"
          label="Descrição"
          variant="outlined"
          :rules="[rules.required]"
        />

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="form.price"
              label="Preço (R$)"
              type="number"
              variant="outlined"
              :rules="[rules.required, rules.positive]"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="form.stock"
              label="Estoque"
              type="number"
              variant="outlined"
              :rules="[rules.required, rules.integer]"
            />
          </v-col>
        </v-row>


        {{ productId }}
        <ImageUploader
          v-if="productId"
          :product-id="productId"
          v-model="form.images"
        />

        <v-alert
          v-if="success"
          type="success"
          class="mb-4"
          border="start"
          variant="tonal"
        >
          {{ isEditMode ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!' }}
        </v-alert>

        <v-alert
          v-if="error"
          type="error"
          class="mb-4"
          border="start"
          variant="tonal"
        >
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          block
          :loading="loading"
          height="45"
        >
          {{ isEditMode ? 'Atualizar Produto' : 'Cadastrar Produto' }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createProduct, getProduct, updateProduct } from '@/services/productService'
import ImageUploader from '@/components/products/ImageUploader.vue'

const router = useRouter()
const route = useRoute()

const isEditMode = ref(!!route.params.id)
const productId = ref<string>(isEditMode.value ? (route.params.id as string) : '')

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  images: [] as { url: string; public_id: string }[],
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const formRef = ref()

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  positive: (v: number) => v > 0 || 'Valor deve ser positivo',
  integer: (v: number) => Number.isInteger(v) || 'Valor deve ser inteiro',
}

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true
    try {
      const data = await getProduct(productId.value)
      form.value = { ...data }
    } catch (err: any) {
      error.value = err?.response?.data?.detail || 'Erro ao carregar produto'
    } finally {
      loading.value = false
    }
  }
})

async function onSubmit() {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    if (isEditMode.value) {
      await updateProduct(productId.value, form.value)
    } else {
      await createProduct(form.value)
      form.value = { name: '', description: '', price: 0, stock: 0, images: [] }
    }
    success.value = true
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao salvar produto'
  } finally {
    loading.value = false
  }
}
</script>
