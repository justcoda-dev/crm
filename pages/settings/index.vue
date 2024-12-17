<template>
  <v-container class="py-4">
    <template v-for="(setting, index) of settingsState" :key="setting.id">
      <settings-card
        class="my-4"
        @update:model-value="onUpdate($event, index)"
        @on-submit="onSubmit(index)"
        @on-cancel="onCancel(index)"
        :setting="setting"
      ></settings-card>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import SettingsCard from "~/components/cards/SettingsCard.vue";

const app = useNuxtApp();
const { data: dataSettings, refresh: refreshDataSettings } =
  await app.$settingService.getSettings();

const settingsFromDb = computed(() => {
  if (dataSettings.value) {
    return dataSettings.value.data.sort((a, b) => a.id - b.id);
  } else {
    return [];
  }
});

const settingsState = ref([...settingsFromDb.value]);

const onUpdate = (setting: any, index: number) => {
  settingsState.value[index] = setting;
};
const onSubmit = async (index: number) => {
  await app.$settingService.updateSetting(settingsState.value[index]);
  refreshDataSettings();
};
const onCancel = (index: number) => {
  settingsState.value[index] = { ...settingsFromDb.value[index] };
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
