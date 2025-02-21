<template>
  <div class="settings h-100">
    <template v-for="(setting, index) of settingsState" :key="index">
      <settings-card
        @update:model-value="onUpdate($event, index)"
        @on-submit="onSubmit(index)"
        @on-cancel="onCancel(index)"
        :setting="setting"
      ></settings-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import SettingsCard from "~/components/cards/SettingsCard.vue";

const app = useNuxtApp();
const { data: dataSettings, refresh: refreshDataSettings } = await useAsyncData(
  async () => await app.$settingService.getData()
);

const settingsFromDb = computed(() => {
  if (dataSettings.value) {
    return dataSettings.value.sort((a: any, b: any) => a.id - b.id);
  } else {
    return [];
  }
});

const settingsState = ref([...settingsFromDb.value]);

const onUpdate = (setting: any, index: number) => {
  settingsState.value[index] = setting;
};
const onSubmit = async (index: number) => {
  await app.$settingService.updateDataById(
    settingsState.value[index],
    settingsState.value[index].id
  );
  refreshDataSettings();
};
const onCancel = (index: number) => {
  console.log(index);
  settingsState.value[index] = { ...settingsFromDb.value[index] };
};
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex: 0 1 auto;
}
</style>
<!-- 1.ціна будні і вихідні 2.кількість максимальна людей 3.максимальний період
    4.мінімальна кількість ночей 5. Окрема сторінка з історією замовлень
    користувача( і можна в таблиці зробити шоб розгортався компонент юзера з
    історією) 6. В таблиці можна зробити ТОТАЛ коштів порахованих, але це треба
    шоб зберігало прайс в БД за скільки знято було номера 7. сторІНКА з інфою
    АДМІНІСТРАТОРА8. Додати того хто броював (менеджера) 9.Відображення всіх
    клієнтів чи тільки цьього менеджера -->
