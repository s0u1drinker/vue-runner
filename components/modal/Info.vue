<script setup lang="ts">
import type { ModalInfo } from '@/types/modal'

const { options } = defineProps<{ options: ModalInfo }>()
</script>

<template>
  <dialog>
    {{ options }}
  </dialog>
</template>

<style scoped></style>