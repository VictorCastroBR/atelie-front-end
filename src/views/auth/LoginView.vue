<template>
  <v-container class="fill-height pa-6" fluid>
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="0" class="pa-6">
          <div class="text-h5 text-center mb-6 font-weight-bold">SIGN IN</div>

          <v-form @submit.prevent="onSubmit" :disabled="auth.loading" ref="formRef">
            <v-text-field
              v-model="email"
              type="email"
              label="E-mail"
              placeholder="usuario@gmail.com"
              variant="underlined"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required, rules.email]"
              autocomplete="username"
            />

            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Senha"
              variant="underlined"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.min]"
              autocomplete="current-password"
            />

            <div class="d-flex align-center mt-1 mb-6 text-body-2">
              <span class="text-medium-emphasis">Não tem uma conta?</span>
              <v-btn variant="text" class="ml-1 px-1" @click="goRegister">
                Registe Aqui
              </v-btn>
            </div>

            <v-alert
              v-if="auth.error"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ auth.error }}
            </v-alert>

            <v-btn
              type="submit"
              block
              height="48"
              :loading="auth.loading"
              class="text-button"
              color="black"
            >
              LOGIN
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref()
const email = ref(null)
const password = ref(null)
const showPassword = ref(false)

const rules = {
  required: (v: string) => (!!v && v.length > 0) || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  min: (v: string) => (v?.length ?? 0) >= 6 || 'Mínimo de 6 caracteres',
}

async function onSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid?.valid) return
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'admin-dashboard' })
  } catch {
  }
}

function goRegister() {
  router.push({ name: 'register' })
}
</script>

<style scoped>
.v-card {
  border: none;
}
.text-button {
  letter-spacing: 1px;
  font-weight: 600;
}
</style>
