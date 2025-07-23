<script setup lang="ts">
import type { SelectOptions } from '@/types/selectOptions'

const { items } = defineProps<{
  items: SelectOptions[]
}>()

const size = '1rem'
</script>

<template>
  <div>
    <button>
      <Icon name="material-symbols:chevron-left" :size />
    </button>
    <div>
      <ul>
        <li v-for="item in items" :key="item.value">{{ item.label }}</li>
      </ul>
    </div>
    <button>
      <Icon name="material-symbols:chevron-right" :size />
    </button>
  </div>
</template>

<style scoped></style>