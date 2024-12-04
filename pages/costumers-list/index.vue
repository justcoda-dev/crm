<template>
  <v-container class="py-4">
    <v-row :class="{ 'flex-column': mobile }">
      <v-col>
        <v-text-field
          append-inner-icon="mdi-magnify"
          v-model="search"
          :label="$t('text-field.search')"
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
    <costumers-table
      v-model:selected="selected"
      :search="search"
      :costumersList="costumersList"
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
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue";
import CostumersTable from "../../components/tables/CostumersTable.vue";
import { useMyMobileStore } from "~/store/mobile";
import { useMyUserStore } from "~/store/user";
import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type { ICostumer, ICostumerData, ICostumersData } from "~/TS/ICostumer";
import type { ICalendarDate } from "~/TS/ICalendarDate";

const app = useNuxtApp();
const mobileStore = useMyMobileStore();
const userStore = useMyUserStore();
const { mobile } = storeToRefs(mobileStore);
const { userHotels } = storeToRefs(userStore);
const hotelsId = userHotels.value.map((hotel) => hotel.id);

const { data: costumers, refresh: refreshCostumers } =
  await app.$useApiFetch<ICostumersData>(
    `/costumers?${requestFiltersCreator(hotelsId, "hotels")}`
  );

const search = ref("");
const selected = ref([]);
const selectedCostumerDates = ref<Date[]>();
const showCreateCostumerForm = ref(false);
const alertMessage = ref("");
const showAlert = ref(false);

const costumersList = computed(() => {
  if (costumers.value) {
    return costumers.value.data;
  } else {
    return [];
  }
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
    selected.value.forEach(async (selectedCostumer: ICostumer) => {
      const { data: costumer } = await app.$apiFetch<ICostumerData>(
        `/costumers/${selectedCostumer.id}?populate=*`
      );
      console.log(costumer);
      if (costumer.calendar_dates.length) {
        selectedCostumerDates.value = costumer.calendar_dates.map(
          (date: ICalendarDate) => {
            const createdDate = new Date(date.start);
            return createdDate;
          }
        );

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
