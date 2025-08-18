<template>
  <div>
    <v-file-input
      v-model="files"
      label="Imagens"
      accept="image/*"
      prepend-icon="mdi-camera"
      multiple
      show-size
      variant="outlined"
      @change="uploadFiles"
    />

    <v-row class="mt-4" dense>
      <v-col
        v-for="(image, i) in modelValue"
        :key="image.public_id"
        cols="6"
        sm="4"
        md="3"
      >
        <v-hover v-slot="{ isHovering, props }">
          <div class="relative" v-bind="props">
            <v-img
              :src="image.url"
              aspect-ratio="1"
              class="rounded-lg"
              cover
            />
            <v-btn
              v-if="isHovering"
              icon="mdi-delete"
              size="small"
              class="remove-btn"
              @click="removeImage(image.public_id)"
            />
          </div>
        </v-hover>
      </v-col>
    </v-row>

    <v-alert
      v-if="error"
      type="error"
      class="mt-2"
      variant="tonal"
    >
      {{ error }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadProductImage, deleteProductImage } from '@/services/imageService'

const props = defineProps<{
  productId: string
  modelValue: { url: string; public_id: string }[]
}>()

const emit = defineEmits(['update:modelValue'])

const files = ref<File[] | null>(null)
const error = ref('')

async function uploadFiles() {
  if (!files.value) return
  error.value = ''
  try {
    for (const file of files.value) {
      const img = await uploadProductImage(props.productId, file)
      emit('update:modelValue', [...props.modelValue, img])
    }
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao enviar imagem'
  } finally {
    files.value = null
  }
}

async function removeImage(publicId: string) {
  error.value = ''
  try {
    await deleteProductImage(props.productId, publicId)
    const filtered = props.modelValue.filter((img) => img.public_id !== publicId)
    emit('update:modelValue', filtered)
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Erro ao excluir imagem'
  }
}
</script>

<style scoped>
.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: white;
}
.relative {
  position: relative;
}
</style>
