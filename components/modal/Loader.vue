<script setup lang="ts">
import type { ModalLoader } from '@/types/modal'

const { options } = defineProps<{ options: ModalLoader }>()
</script>

<template>
  <ModalBase :closable="options.closable" :id="options.id">
    <template #body>
      <div class="modal-loader">
        <Icon :name="options.loaderName" size="4rem" />
        <p v-if="options.text">{{ options.text }}</p>
      </div>
    </template>
  </ModalBase>
</template>

<style scoped>
.modal-loader {
  display: flex;
  flex-direction: column;
  gap: var(--indent);
  align-items: center;
}
</style>