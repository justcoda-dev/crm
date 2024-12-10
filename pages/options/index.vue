<template>
  <v-container class="py-4">
    {{ options }}
    <component :is="components[currComponent]"></component>
  </v-container>
</template>

<script lang="ts" setup>
const app = useNuxtApp();
const { data: options } = await app.$apiFetch("/options?populate=*");
const components = shallowRef({});
const currComponent = ref();
</script>

<style lang="scss" scoped></style>
<!-- 1.ціна будні і вихідні 2.кількість максимальна людей 3.максимальний період
    4.мінімальна кількість ночей 5. Окрема сторінка з історією замовлень
    користувача( і можна в таблиці зробити шоб розгортався компонент юзера з
    історією) 6. В таблиці можна зробити ТОТАЛ коштів порахованих, але це треба
    шоб зберігало прайс в БД за скільки знято було номера 7. сторІНКА з інфою
    АДМІНІСТРАТОРА8. Додати того хто броював (менеджера) 9.Відображення всіх
    клієнтів чи тільки цьього менеджера -->
