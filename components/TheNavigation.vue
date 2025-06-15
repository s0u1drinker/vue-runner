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
        <NuxtLink class="navigation__link" to="/stat">
          <Icon name="material-symbols:bar-chart-4-bars" :size />
          <span>Статистика</span>
        </NuxtLink>
      </li>
      <li class="navigation__item">
        <NuxtLink class="navigation__link" to="/add">
          <Icon name="material-symbols:add-2" :size />
          <span>Добавить</span>
        </NuxtLink>
      </li>
      <li class="navigation__item" v-if="!isAuthenticated()">
        <NuxtLink class="navigation__link" to="/login">
          <Icon name="material-symbols:login-sharp" :size />
          <span>Войти</span>
        </NuxtLink>
      </li>
      <template v-else>
        <li class="navigation__item">
          <NuxtLink class="navigation__link" to="/settings">
            <Icon name="material-symbols:settings-account-box-sharp" :size />
            <span>Профиль</span>
          </NuxtLink>
        </li>
        <li class="navigation__item color_red">
          <NuxtLink class="navigation__link" to="/login">
            <Icon name="material-symbols:logout-sharp" :size />
            <span>Выйти</span>
          </NuxtLink>
        </li>
      </template>
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
  font-size: 10px;
  z-index: 100;

  @media (--viewport-sm) {
    font-size: 1rem;
  }

  @media (--viewport-md) {
    border: 0;
    color: var(--black);
    padding: var(--indent);
    top: 0;
    height: fit-content;
    z-index: auto;
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
    padding: var(--indent) var(--indent-quarter);
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