<script setup lang="ts">
// Размер иконки.
const size: string = "1.25rem";
</script>

<template>
  <nav class="navigation">
    <ul class="navigation__list">
      <li class="navigation__item">
        <NuxtLink class="navigation__link" to="/">
          <Icon name="material-symbols:directions-run" :size />
          <span>Тренировки</span>
        </NuxtLink>
      </li>
      <li class="navigation__item">
        <NuxtLink class="navigation__link" to="/add">
          <Icon name="material-symbols:add-2" :size />
          <span>Добавить</span>
        </NuxtLink>
      </li>
      <li class="navigation__item">
        <NuxtLink class="navigation__link" to="/stat">
          <Icon name="material-symbols:bar-chart-4-bars" :size />
          <span>Статистика</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import '@/assets/css/media.postcss';

.navigation {
  border-top: var(--border);
  color: var(--dark-gray);
  position: sticky;
  bottom: 0;
  background-color: var(--white);

  @media (--viewport-md) {
    border: 0;
    color: var(--black);
    padding: var(--indent);
    top: 0;
    height: fit-content;
  }

  &__list {
    display: flex;

    @media (--viewport-md) {
      border: var(--border);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      flex-direction: column;
      overflow: hidden;
    }
  }

  &__item {
    flex: 1;
  }

  &__link {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    padding: var(--indent) 0;
    flex-direction: column;
    transition: background-color var(--animation);
    -webkit-tap-highlight-color: transparent;

    &_active {
      color: var(--black);
      pointer-events: none;

      @media (--viewport-md) {
        background-color: var(--sky-blue);
      }
    }

    @media (--viewport-md) {
      gap: var(--indent-half);
      flex-direction: row;
      padding: var(--list-item-padding);
    }

    @media (hover: hover) {
      &:hover {
        background-color: var(--light-gray);
      }
    }
  }
}
</style>