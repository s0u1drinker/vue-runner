<script setup lang="ts">
import ModalLoader from '@/components/modal/Loader.vue'
import ModalDialog from '@/components/modal/Dialog.vue'
import ModalInfo from '@/components/modal/Info.vue'
import type { ModalType } from '@/types/modal'

const modals = useModalStore().modals

const MODAL_TYPE: Readonly<Record<ModalType, any>> = {
  'info': ModalInfo,
  'dialog': ModalDialog,
  'loader': ModalLoader,
}
</script>

<template>
  <Teleport to="body">
    <template v-for="modal in modals">
      <component
        :is="MODAL_TYPE[modal.type] || false"
        :options="{ ...modal }"
      />
    </template>
  </Teleport>
</template>

<style scoped></style>