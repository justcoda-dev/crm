<template>
  <v-row align="start" class="ma-1">
    <v-col xs="7" sm="6" md="5" lg="4">
      <options-card
        class="options-card__price"
        :list="settingsData"
        :disabled="disabledButtons"
        @onSaveClick="onSaveClick"
        @onCancelClick="onCancelClick"
        @onInput="onInput"
        @onFocused="onFocused"
      ></options-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import OptionsCard from "~/components/cards/OptionsCard.vue";
const app = useNuxtApp();
const { t } = useI18n();

const { data: settings, refresh: refreshSettings } = await app.$useApiFetch(
  "/settings"
);

const settingsFromDbInitial = computed(() => {
  if (settings.value) {
    return settings.value.data.map((setting) => {
      return {
        id: setting.id,
        title: t(`title.${setting.attributes.key}`),
        changed: false,
        ...setting.attributes,
      };
    });
  } else {
    return [];
  }
});

const settingsData = ref([...settingsFromDbInitial.value]);
const disabledButtons = ref(true);

const onInput = ({ value, index }: { value: string; index: number }) => {
  settingsData.value[index] = {
    ...settingsData.value[index],
    value,
    changed: true,
  };
  disabledButtons.value = false;
};

const onSaveClick = () => {
  settingsData.value.forEach(async (setting) => {
    if (setting.changed) {
      try {
        await app.$apiFetch(`/settings/${setting.id}`, {
          method: "PUT",
          body: {
            data: { value: setting.value },
          },
        });
        disabledButtons.value = true;
      } catch (e) {
        console.error("error in  PUT settings,", e);
      }
    }
  });
};

const onCancelClick = () => {
  settingsData.value = [...settingsFromDbInitial.value];
  disabledButtons.value = true;
};

const onFocused = ({ value, index }: { value: boolean; index: number }) => {
  if (!value && !settingsData.value[index].value.length) {
    settingsData.value[index].value = settingsFromDbInitial.value[index].value;
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
