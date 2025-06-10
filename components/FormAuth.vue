<script setup lang=ts>
import type { AuthData } from '@/types/authData'

const authData: AuthData = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')

function submitForm(): void {
  if (isValidData()) {
    //
  }
}

function isValidData(): boolean {
  errorMessage.value = 'Ошибка!'
  return false
}
</script>

<template>
  <TheForm title="Авторизация" :message="errorMessage">
    <template #body>
      <input class="input" type="email" placeholder="E-mail" v-model="authData.email" />
      <input class="input" type="password" placeholder="Пароль" v-model="authData.password" />
    </template>
    <template #buttons>
      <button class="button button_hover button_hover_blue" @click.prevent="$emit('change-form', true)">Регистрация</button>
      <button class="button button_blue" type="submit" @click.prevent="submitForm">Войти</button>
    </template>
  </TheForm>
</template>

<style scoped></style>