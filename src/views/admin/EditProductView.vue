<template>
  <v-container class="pa-4" fluid>
    <v-card max-width="600" class="mx-auto pa-6 elevation-1">
      <v-card-title class="text-h6 font-weight-bold mb-4">
        Editar Produto
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

        <v-alert
          v-if="success"
          type="success"
          class="mb-4"
          border="start"
          variant="tonal"
        >
          Produto atualizado com sucesso!
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
          Atualizar Produto
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, updateProduct } from '@/services/productService'

const router = useRouter()
const route = useRoute()

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  images: [],
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
  loading.value = true
  try {
    const id = route.params.id as string
    const data = await getProduct(id)
    form.value = { ...data }
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao carregar produto'
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const id = route.params.id as string
    await updateProduct(id, form.value)
    success.value = true
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao atualizar produto'
  } finally {
    loading.value = false
  }
}
</script>
