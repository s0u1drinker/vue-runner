<script setup lang="ts">
const props = withDefaults(defineProps<{
  showText?: string,
  errorCode: string,
}>(), {
  showText: 'Похоже, что-то сломалось. Попробуйте обновить страницу или зайти позже.',
})

onMounted(() => {
  console.error(APP_ERRORS.get(props.errorCode))
})
</script>

<template>
  <h1>Ошибка!</h1>
  <p>{{ props.showText }}</p>
</template>

<style scoped></style>