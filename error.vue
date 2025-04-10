<script setup lang="ts">
const error = useError();
</script>

<template>
  <NuxtLayout>
    <h1>Уп-с, ошибка {{ error?.statusCode }}...</h1>
  </NuxtLayout>
</template>

<style scoped></style>