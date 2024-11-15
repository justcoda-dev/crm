<template>
  <v-container class="py-4">
    <Calendar
      @selectDates="onSelectDates"
      @changeMonth="onChangeMonth"
      @onReservedDayClick="onReservedDayClick"
      :reserved-dates="reservedDates?.data"
    ></Calendar>
    <mobile-dialog v-if="mobile" v-model="showCreateCostumerForm">
      <v-card class="pa-2 h-100 justify-center">
        <template #title>
          {{ $t("title.create-user") }}
        </template>
        <create-costumer-form
          @keyup.esc="onCancelCostumerCreateForm"
          @cancelCLick="onCancelCostumerCreateForm"
          @submitForm="onSubmitFormAndRefreshCalendarData"
        />
      </v-card>
    </mobile-dialog>
    <v-dialog class="dialog" v-model="showCreateCostumerForm">
      <v-card class="pa-4 costumer-card-form">
        <template #title>
          {{ $t("title.create-user") }}
        </template>
        <create-costumer-form
          @keyup.esc="onCancelCostumerCreateForm"
          @cancelCLick="onCancelCostumerCreateForm"
          @submitForm="onSubmitFormAndRefreshCalendarData"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEditForm">
      <v-card class="pa-4">
        <template #title>
          {{ $t("title.edit-user") }}
        </template>
        <edit-costumer-form
          :editCostumer="editCostumer"
          @keyup.esc="onCancelCostumerEditForm"
          @cancelCLick="onCancelCostumerEditForm"
          @submitForm="onSubmitCostumerEditForm"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-model="userInfo">
      <UserInfoCard :costumer="costumerInfo" />
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import type { ICalendarDates } from "~/TS/ICalendarDate";
import { useMyMobileStore } from "~/store/mobile";
import { useMyUserStore } from "~/store/user";
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue";
import EditCostumerForm from "../../components/forms/EditCostumerForm.vue";

import MobileDialog from "~/components/dialog/MobileDialog.vue";
import { useCreateCostumerForm } from "~/composable/useCreateCostumerForm";

import { useRoute } from "vue-router";

import type { ID } from "~/TS/myTypes";
import { useEditCostumerForm } from "~/composable/useEditCostumerForm";
import type { IDay } from "~/TS/Calendar";
import UserInfoCard from "~/components/cards/CostumerInfoCard.vue";
const show = ref(true);
const app = useNuxtApp();
const route = useRoute();
const router = useRouter();
const { mobile } = storeToRefs(useMyMobileStore());
const { user } = storeToRefs(useMyUserStore());
const defaultDate = ref(new Date());
const userInfo = ref(false);
const costumerInfo = ref({});

const { data: reservedDates, refresh: refreshCalendarDatesFromDb } =
  await app.$useApiFetch<ICalendarDates>(() => `/calendar-dates?populate=*`);
watch(
  () => reservedDates.value,
  () => {
    console.log(reservedDates.value);
  },
  { immediate: true }
);
const onReservedDayClick = (day: IDay) => {
  costumerInfo.value = day.costumer;
  userInfo.value = true;
};
const onSelectDates = (dates: {
  start: { year: number; month: number; day: number };
  end: { year: number; month: number; day: number };
  filter_date: string;
  total_price: number;
  daysCount: number;
}) => {
  onShowCreateCostumerForm({
    ...dates,
    start: `${dates.start.year}-${dates.start.month}-${dates.start.day}`,
    end: `${dates.end.year}-${dates.end.month}-${dates.end.day}`,
  });
};
const {
  showForm: showCreateCostumerForm,
  onSubmitForm: onSubmitCreateForm,
  onCancelForm: onCancelCostumerCreateForm,
  onShowForm: onShowCreateCostumerForm,
} = useCreateCostumerForm();

const onSubmitFormAndRefreshCalendarData = async (formCostumer: {
  name: string;
  phone: string;
  userFromDb: boolean;
  userId: ID;
}) => {
  await onSubmitCreateForm({
    ...formCostumer,
    user: user.value,
  });
  await refreshCalendarDatesFromDb();
};

const {
  editCostumer,
  showForm: showEditForm,
  onShowForm: onShowEditCostumerForm,
  onSubmit: onSubmitEditForm,
  onCancelEdit: onCancelCostumerEditForm,
} = useEditCostumerForm();

const onSubmitCostumerEditForm = async (formCostumer: {
  name: string;
  phone: string;
  id: ID;
}) => {
  await onSubmitEditForm(formCostumer);
  await refreshCalendarDatesFromDb();
};

const onChangeMonth = ({ month, year }: { month: number; year: number }) => {
  router.push({ query: { year, month } });
};

const onDeleteReservedMenu = async (id: number) => {
  try {
    const { data }: any = await app.$apiFetch(`/calendar-dates/${id}`, {
      method: "DELETE",
    });
    if (data.id) {
      refreshCalendarDatesFromDb();
    }
  } catch (e) {
    console.error(e);
  }
};
watch(
  () => route.query,
  (qeury) => {
    if (!qeury.month && route.path === "/calendar") {
      router.push({
        query: {
          year: defaultDate.value.getFullYear(),
          month: defaultDate.value.getMonth() + 1,
        },
      });
    }
  },
  { immediate: true, deep: true }
);
onMounted(() => {});
</script>

<style lang="scss">
.v-overlay {
  .v-overlay__content {
    // background-color: black;
    // align-items: center;
  }
}
</style>
