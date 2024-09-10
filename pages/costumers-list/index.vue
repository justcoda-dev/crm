<template>
  <v-container class="py-4">
    <v-row :class="{ 'flex-column': mobileClass }">
      <v-col>
        <v-text-field
          v-model="search"
          :label="$t('text-field.search')"
          append-inner-icon="mdi-magnify"
        />
      </v-col>
      <v-col>
        <v-btn @click="onOpenCreateForm">{{ $t("button-add") }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn :disabled="!selected.length" @click="onDeleteCostumer">{{
          $t("button-delete")
        }}</v-btn>
      </v-col>
    </v-row>
    <users-table
      :search="search"
      v-model:selected="selected"
      :usersList="costumersList"
    />
    <v-dialog v-model="showCreateCostumerForm">
      <v-card class="pa-4">
        <template #title>
          {{ $t("title.create-user") }}
        </template>
        <create-costumer-form
          @keyup.esc="onCancelCostumerCreateForm"
          @cancelCLick="onCancelCostumerCreateForm"
          @submitForm="onSubmitCreateForm"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAlert">
      <v-alert type="error" :text="alertMessage">
        <nuxt-link
          class="mr-1 text-white"
          v-for="({ link, date }, index) of selectedCostumerDatesAndLinks"
          :to="link"
          :key="index"
        >
          {{ date.toLocaleDateString() }}
        </nuxt-link>
      </v-alert>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import UsersTable from "../../components/tables/UsersTable.vue";
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue";
import { useMyMobileStore } from "~/store/mobile";
const app = useNuxtApp();
const { mobile } = storeToRefs(useMyMobileStore());
const mobileClass = computed(() => useMyMobileStore().mobile);

const {
  data: costumers,
  refresh: refreshCostumers,
}: { data: any; refresh: any } = await app.$useApiFetch("/costumers");

const search = ref("");
const selected = ref([]);
const selectedCostumerDates = ref<Date[]>([]);
const showCreateCostumerForm = ref(false);
const alertMessage = ref("");
const showAlert = ref(false);

const costumersList = computed(() => {
  return costumers.value?.data;
});
const selectedCostumerDatesAndLinks = computed(() =>
  selectedCostumerDates.value.map((date: Date) => {
    return {
      link: `/calendar?month=${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }`,
      date,
    };
  })
);
const onOpenCreateForm = () => {
  showCreateCostumerForm.value = true;
};

const onCancelCostumerCreateForm = () => {
  showCreateCostumerForm.value = false;
};
const onDeleteCostumer = async () => {
  if (selected.value.length) {
    selected.value.forEach(async (selectedCostumer) => {
      const costumerDates = await app.$apiFetch(
        `/costumers/${selectedCostumer.id}?populate=*`
      );

      if (costumerDates.data.attributes.calendar_dates.data.length) {
        selectedCostumerDates.value =
          costumerDates.data.attributes.calendar_dates.data.map((date) => {
            const createdDate = new Date(date.attributes.start);
            return createdDate;
          });

        alertMessage.value = `Неможливо видалити користувача, так як є заброньовані дати поваязані з ним: `;
        showAlert.value = true;
        return;
      } else {
        try {
          const deletedCostumer = await app.$apiFetch(
            `/costumers/${selectedCostumer.id}`,
            {
              method: "DELETE",
            }
          );
          refreshCostumers();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
};
const onSubmitCreateForm = async (formData: object) => {
  showCreateCostumerForm.value = false;
  try {
    const createCostumer = await app.$apiFetch(`/costumers`, {
      method: "POST",
      body: {
        data: {
          ...formData,
        },
      },
    });
    refreshCostumers();
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped></style>
