<template>
  <v-form @submit.prevent="onSubmitForm">
    <v-combobox
      v-model="form.model.value.name"
      v-model:menu="menuState"
      :label="$t('text-field.name.placeholder')"
      :items="costumersList"
      :hide-no-data="hideNoData"
      :error-messages="form.errorMessages.value?.name"
    >
      <template #item="{ item }">
        <v-list-item @click="selectCostumerFromDb(item)">
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
      :label="$t('text-field.phone.placeholder')"
      v-model.trim="form.model.value.phone"
      :error-messages="form.errorMessages.value?.phone"
    />
    <v-btn type="submit" class="ml-4" :disabled="disabledSubmitButton">
      {{ $t("button-submit") }}
    </v-btn>
    <v-btn class="ml-4" @click="onCancel">
      {{ $t("button-cancel") }}
    </v-btn>
  </v-form>
</template>

<script lang="ts" setup>
import type { ICostumer } from "~/TS/ICostumer";
import { useValidation } from "~/functions/useValidation";

const emit = defineEmits();
const app = useNuxtApp();

const debounceTimeMs = 300;

const initialForm = {
  name: "",
  phone: "",
  userFromDb: false,
  userId: null,
};

const menuState = ref(false);
const disabledSubmitButton = ref(true);
const hideNoData = ref(false);
const costumersFromDb = ref<ICostumer[]>([]);
const userWantToCreateCostumer = ref(false);

const costumersList = computed(() => {
  if (costumersFromDb.value?.length) {
    return costumersFromDb.value.map((item: ICostumer) => {
      return {
        title: item.attributes.name,
        id: item.id,
        phone: item.attributes.phone,
      };
    });
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
        fn: (value: string) => +value,
        errorMessage: "Номер складається тільки з цифер",
      },
    ],
  },
]);

const selectCostumerFromDb = (item: any) => {
  form.model.value.userFromDb = true;
  form.model.value.name = item.title;
  form.model.value.phone = item.raw.phone;
  form.model.value.userId = item.raw.id;
  nextTick(() => {
    disabledSubmitButton.value = false;
    menuState.value = false;
  });
};

const selectCreateNewCostumer = () => {
  menuState.value = false;
  form.model.value.userFromDb = false;
  userWantToCreateCostumer.value = true;
};

const onSubmitForm = () => {
  emit("submitForm", form.model.value);
  form.model.value = initialForm;
};

const onCancel = () => {
  emit("cancelCLick");
};

watch(
  () => form.model.value.name,
  _debounce(async (name) => {
    try {
      if (name?.length > 3 && !form.model.value.userFromDb) {
        const { data }: any = await app.$apiFetch(
          `/costumers?filters[name][$containsi]=${name}`
        );
        costumersFromDb.value = data;
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
