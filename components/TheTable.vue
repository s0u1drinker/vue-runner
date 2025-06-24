<script setup lang="ts">
const { caption, noData = 'Нет данных' } = defineProps<{
  caption?: string,
  noData?: string
}>()
</script>

<template>
  <table class="table">
    <caption v-if="caption">{{ caption }}</caption>
    <thead class="table__thead" v-if="$slots.thead">
      <slot name="thead"></slot>
    </thead>
    <tbody class="table__tbody">
      <slot name="tbody" v-if="$slots.tbody"></slot>
      <tr class="table__no-data" v-else>
        <td colspan="100%">{{ noData }}</td>
      </tr>
    </tbody>
    <tfoot class="table__tfoot" v-if="$slots.tfoot">
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
</template>

<style scoped>
.table {
  font-size: 0.825rem;

  @media (--viewport-sm) {
    font-size: inherit;
  }

  &__thead {
    background-color: var(--light-gray);
    border-bottom: 1px solid var(--black);
  }

  &__tbody {
    border-bottom: var(--border);

    & > tr {
      transition: background-color var(--animation);
  
      &:hover {
        background-color: var(--powder-blue);
        cursor: pointer;
      }
  
      & + & {
        border-top: var(--border);
      }
    }
  }
  

  &__no-data {
    text-align: center;
    color: var(--gray);
  }
}
</style>