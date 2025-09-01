<script setup lang="ts">
import type { ModalDialog } from '@/types/modal'

const { options } = defineProps<{ options: ModalDialog }>()
</script>

<template>
  <ModalBase
    :id="options.id"
    :closable="options.closable"
    :header="options.header"
  >
    <template #body>
      <p>{{ options.body }}</p>
    </template>
    <template #buttons>
      <button
        v-for="(button, index) in options.buttons"
        :class="{
          'button': true,
          'button_outline_gray': (index === 'close'),
          'button_blue': (index === 'confirm'),
        }"
        @click="button.action()"
        :key="index"
      >{{ button.title }}</button>
    </template>
  </ModalBase>
</template>

<style scoped></style>