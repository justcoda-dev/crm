<template>
  <v-form @submit.prevent="onSubmitClick">
    <v-card class="pa-4 justify-center">
      <v-card-title>Створити клієнта</v-card-title>
      <v-card-text class="px-8 py-2">
        <v-combobox
          variant="underlined"
          v-model="form.model.value.name"
          v-model:menu="menuState"
          :label="$t('text-field.name.placeholder')"
          :items="costumersList"
          :hide-no-data="hideNoData"
          :error-messages="form.errorMessages.value?.name"
        >
          <template #item="{ item }">
            <v-list-item @click="selectCostumerFromDb(item.raw.costumer)">
              {{ item.value }}
            </v-list-item>
          </template>
          <template #no-data v-if="!hideNoData">
            <v-list-item @click="selectCreateNewCostumer">
              Клієнта "<b>{{ form.model.value.name }}</b
              >" в базі не знайдено. Нажміть ентер або <b>сюди</b> щоб тсворити.
            </v-list-item>
          </template>
        </v-combobox>
        <v-combobox
          variant="underlined"
          v-model.trim="form.model.value.phone"
          :label="$t('text-field.phone.placeholder')"
          :error-messages="form.errorMessages.value.phone"
        />
      </v-card-text>
      <v-card-actions class="mx-auto">
        <v-btn variant="text" type="submit" :disabled="disabledSubmitButton">
          {{ $t("button-submit") }}
        </v-btn>
        <v-btn variant="text" @click="onCancel">
          {{ $t("button-cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
import type { ICostumer } from "~/TS/ICostumer";
import { useValidation } from "~/functions/useValidation";
import { useMyUserStore } from "~/store/user";
import { requestFiltersCreator } from "../../functions/requestFiltersCreate";
const emit = defineEmits(["submitClick", "cancelClick"]);
const app = useNuxtApp();

const debounceTimeMs = 300;

const initialForm = {
  name: "",
  phone: "",
  costumer_from_db: false,
  id: 0,
};
const costumersFromDb = ref<ICostumer[]>();
const menuState = ref(false);
const disabledSubmitButton = ref(true);
const hideNoData = ref(false);
const userWantToCreateCostumer = ref(false);

const costumersList = computed(() => {
  if (costumersFromDb.value?.length) {
    return costumersFromDb.value.map((costumerFromDb: ICostumer) => {
      return {
        title: costumerFromDb.name,
        id: costumerFromDb.id,
        phone: costumerFromDb.phone,
        costumer: costumerFromDb,
      };
    });
  } else {
    return [];
  }
});

const form = useValidation(initialForm, [
  {
    prop: "name",
    rules: [
      {
        fn: (value: string) => value?.length > 4,
        errorMessage: "Імя'я має мітити більше 4 символів",
      },
    ],
  },
  {
    prop: "phone",
    rules: [
      {
        fn: (value: string) => value?.startsWith("+38"),
        errorMessage: "Номер телефону повинен починатись з '+380'",
      },
      {
        fn: (value: string) => value?.length === 13,
        errorMessage: "Номер телефону мітить біль 13 символів",
      },
      {
        fn: (value: string) => value,
        errorMessage: "Номер складається тільки з цифер",
      },
    ],
  },
]);

const selectCostumerFromDb = (costumerFromDb: ICostumer) => {
  form.model.value.costumer_from_db = true;
  form.model.value.name = costumerFromDb.name;
  form.model.value.phone = costumerFromDb.phone;
  form.model.value.id = costumerFromDb.id;
  nextTick(() => {
    disabledSubmitButton.value = false;
    menuState.value = false;
  });
};

const selectCreateNewCostumer = () => {
  menuState.value = false;
  form.model.value.costumer_from_db = false;
  userWantToCreateCostumer.value = true;
};

const onSubmitClick = () => {
  emit("submitClick", form.model.value);
  form.model.value = initialForm;
};

const onCancel = () => {
  emit("cancelClick");
};

watch(
  () => form.model.value.name,
  _debounce(async (name) => {
    const userStore = useMyUserStore();

    try {
      if (name?.length > 3 && !form.model.value.costumer_from_db) {
        const { data: costumers }: any = await app.$apiFetch(
          `/costumers?filters[name][$containsi]=${name}&${requestFiltersCreator(
            userStore.userHotels.map((hotel) => hotel.id),
            "hotels"
          )}`
        );

        costumersFromDb.value = costumers;
      }
    } catch (e) {
      console.error("create form watcher err", e);
    }
  }, debounceTimeMs)
);

watch(
  () => form.model.value.name,
  (name: string) => {
    if (userWantToCreateCostumer.value || name === null || name?.length < 3) {
      hideNoData.value = true;
    } else {
      hideNoData.value = false;
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => form.haveErrors.value,
  (status: any) => {
    disabledSubmitButton.value = status;
  }
);
</script>

<style lang="scss" scoped>
.v-combobox {
  &__select-item {
    cursor: pointer;
  }
}
</style>
