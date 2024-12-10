<template>
  <v-form>
    <v-card class="pa-4">
      <v-card-title>Створити Готель</v-card-title>
      <v-card-text class="px-8 py-2">
        <v-combobox
          variant="underlined"
          v-model="form"
          v-model:menu="menuState"
          :label="$t('text-field.name.placeholder')"
          :items="hotelsList"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
        <v-combobox
          variant="underlined"
          v-model="form"
          v-model:menu="menuState"
          :label="$t('text-field.name.placeholder')"
          :items="hotelsList"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
        <v-combobox
          variant="underlined"
          v-model="form"
          v-model:menu="menuState"
          :label="$t('text-field.name.placeholder')"
          :items="hotelsList"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
      </v-card-text>
      <v-card-actions
        ><v-btn variant="text" type="submit">
          {{ $t("button-submit") }}
        </v-btn>
        <v-btn variant="text">
          {{ $t("button-cancel") }}
        </v-btn></v-card-actions
      >
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
const menuState = ref(false);
const form = ref();
const hotelsList = ref();
const hideNoData = ref(false);
const errorMessages = ref();
</script>

<style></style>
