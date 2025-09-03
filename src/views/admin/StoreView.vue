<template>
  <v-container class="pa-4" fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h6 font-weight-bold">Informações da Loja</h2>
    </div>

    <v-alert v-if="error" type="error" class="mb-4" border="start" variant="tonal">
      {{ error }}
    </v-alert>

    <v-alert v-if="success" type="success" class="mb-4" border="start" variant="tonal">
      Dados atualizados com sucesso!
    </v-alert>

    <v-skeleton-loader v-if="loading" type="card" class="mx-auto" max-width="500" />

    <v-card v-else>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Nome da Loja" v-model="form.name" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="CNPJ" v-model="form.cnpj" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Telefone" v-model="form.phone_number" />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch label="Loja Aberta?" v-model="form.is_open" inset />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field label="Rua" v-model="form.address.street" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Número" v-model="form.address.number" type="number" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="Bairro" v-model="form.address.district" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Cidade" v-model="form.address.city" />
            </v-col>
            <v-col cols="12" md="1">
              <v-text-field label="UF" v-model="form.address.state" maxlength="2" />
            </v-col>

            <v-col cols="12">
              <v-file-input
                label="Imagem da loja"
                accept="image/*"
                v-model="image"
                show-size
                @update:model-value="uploadImage"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" @click="onSubmit">Salvar Alterações</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StoreUpdatePayload } from '@/services/storeService'
import { getStore, updateStore, uploadStoreImage } from '@/services/storeService'

const storeId = ref<string>('')
const form = ref<StoreUpdatePayload>({
  name: '',
  cnpj: '',
  phone_number: '',
  is_open: false,
  img: null,
  address: {
    street: '',
    number: 0,
    district: '',
    city: '',
    state: '',
  },
})

const image = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const formRef = ref()

onMounted(async () => {
  loading.value = true
  try {
    const data = await getStore()
    storeId.value = data.id
    form.value = data
  } catch (err: any) {
    error.value = 'Erro ao carregar os dados da loja'
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
    await updateStore(storeId.value, form.value)
    success.value = true
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao atualizar a loja'
  } finally {
    loading.value = false
  }
}

async function uploadImage() {
   try {
    if (image.value) {
      const formData = new FormData()
      formData.append('file', image.value)
      await uploadStoreImage(storeId.value, formData)
    }
    success.value = true
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao atualizar a foto da loja'
  } finally {
    loading.value = false
  }
}
</script>
