<script setup lang="ts">
const error = useError();
</script>

<template>
  <NuxtLayout>
    <h1>Упс, ошибка {{ error?.statusCode }}...</h1>
  </NuxtLayout>
</template>

<style scoped></style>