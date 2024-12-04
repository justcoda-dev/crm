<template>
  <v-container class="py-4">
    <v-row>
      <v-col>
        <template v-for="optionItem of optionsData" :key="optionItem.id">
          <options-card
            class="options-card__price ma-2"
            :item="optionItem"
            @onSave="onSaveClick(optionItem)"
          />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import OptionsCard from "~/components/cards/OptionsCard.vue";
import type { IOption, IOptionsData } from "~/TS/IOption";
const app = useNuxtApp();

const { data: options, refresh: refreshOptions } =
  await app.$useApiFetch<IOptionsData>("/options?populate=*");

const optionsData = computed(() => {
  if (options.value) {
    return options.value.data
      .map((option) => ({ ...option, id: option.id }))
      .sort((a, b) => a.id - b.id);
  } else {
    return [];
  }
});

const onSaveClick = (optionItem: IOption) => {
  try {
    app.$apiFetch(`options/${optionItem.id}`, {
      method: "PUT",
      body: {
        data: {
          ...optionItem,
        },
      },
    });
    refreshOptions();
  } catch (e) {
    console.error(e);
  }
};
</script>

<style lang="scss" scoped></style>
<!-- 1.ціна будні і вихідні 2.кількість максимальна людей 3.максимальний період
    4.мінімальна кількість ночей 5. Окрема сторінка з історією замовлень
    користувача( і можна в таблиці зробити шоб розгортався компонент юзера з
    історією) 6. В таблиці можна зробити ТОТАЛ коштів порахованих, але це треба
    шоб зберігало прайс в БД за скільки знято було номера 7. сторІНКА з інфою
    АДМІНІСТРАТОРА8. Додати того хто броював (менеджера) 9.Відображення всіх
    клієнтів чи тільки цьього менеджера -->
