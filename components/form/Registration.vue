<script setup lang=ts>
import type { RegistrationData } from '@/types/registrationData'

const registrationData: RegistrationData = {
  email: '',
  password: '',
  username: '',
}

const errorMessage = ref('')

function submitForm(): void {
  if (isValidData()) {
    //
  }
}

function isValidData(): boolean {
  errorMessage.value = 'В данный момент регистрация неозможна =('
  return false
}
</script>

<template>
  <TheForm title="Регистрация" :message="errorMessage">
    <template #body>
      <input class="input" type="email" placeholder="E-mail" v-model="registrationData.email" />
      <input class="input" type="password" placeholder="Пароль" v-model="registrationData.password" />
      <input class="input" type="text" placeholder="Имя" v-model="registrationData.username" />
    </template>
    <template #buttons>
      <button class="button button_hover button_hover_blue" @click.prevent="$emit('change-form', true)">Войти</button>
      <button class="button button_blue" type="submit" @click.prevent="submitForm">Регистрация</button>
    </template>
  </TheForm>
</template>

<style scoped></style>