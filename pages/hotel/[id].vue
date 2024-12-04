<template>
  <v-container class="py-4">
    <Calendar
      :reserved-dates="reservedDates"
      @select-dates="onSelectDates"
      @change-month="onChangeMonth"
      @on-reserved-day-click="onReservedDayClick"
    ></Calendar>

    <v-bottom-sheet v-if="mobile" v-model="showCreateCostumerForm">
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
    </v-bottom-sheet>

    <v-dialog v-else v-model="showCreateCostumerForm">
      <v-card class="pa-4 mx-sm-auto" width="500px">
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

    <v-bottom-sheet v-if="mobile" v-model="costumerInfoShow">
      <costumer-info-card
        v-if="dayInfo"
        :costumer="dayInfo.costumer"
        @on-delete="onCostumerInfoCardDelete"
        class="pa-4"
      >
        <template #information>
          <div class="text-center">
            Заброньовано з: {{ dayInfo.start }} по
            {{ dayInfo.end }}
          </div>
        </template>
      </costumer-info-card>
    </v-bottom-sheet>

    <v-dialog v-else v-model="costumerInfoShow">
      <costumer-info-card
        v-if="dayInfo"
        :costumer="dayInfo.costumer"
        @on-delete="onCostumerInfoCardDelete"
        class="pa-4"
      >
        <template #information>
          <div style="text-align: center">
            Заброньовано з: {{ dayInfo?.start }} по
            {{ dayInfo?.end }}
          </div>
        </template>
      </costumer-info-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import type {
  ICalendarDates,
  ICalendarDate,
  ICalendarDateData,
} from "~/TS/ICalendarDate";
import { useMyMobileStore } from "~/store/mobile";
import { useMyUserStore } from "~/store/user";
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue";
import EditCostumerForm from "../../components/forms/EditCostumerForm.vue";
import Calendar from "../../components/calendar/Calendar.vue";

import {
  useCreateCostumerForm,
  type ICreateingCalendarDate,
} from "~/composable/useCreateCostumerForm";
import { useRoute } from "vue-router";
import type { ID } from "~/TS/myTypes";
import { useEditCostumerForm } from "~/composable/useEditCostumerForm";
import type { IDay } from "~/TS/IDay";
import CostumerInfoCard from "~/components/cards/CostumerInfoCard.vue";

const app = useNuxtApp();
const route = useRoute();
const router = useRouter();

const { mobile } = storeToRefs(useMyMobileStore());
const { user } = storeToRefs(useMyUserStore());

const defaultDate = ref(new Date());
const costumerInfoShow = ref(false);
const dayInfo = ref<ICalendarDate>();

const { data: reservedDatesData, refresh: refreshCalendarDatesFromDb } =
  await app.$useApiFetch<ICalendarDates>(
    () => `/calendar-dates?filters[hotel]=${route.params.id}&populate=*`
  );

const reservedDates = computed(() => {
  if (reservedDatesData.value) {
    return reservedDatesData.value.data;
  } else {
    return undefined;
  }
});

const hotelId = computed(() =>
  !Array.isArray(route.params.id) ? parseInt(route.params.id) : undefined
);

const onReservedDayClick = (day: IDay) => {
  const [dateFromDb] = reservedDates.value
    ? reservedDates.value.filter((date) => {
        if (day.startDate && day.costumerEnter) {
          return (
            date.start === day.fullDate &&
            date.costumer.id === day.costumerEnter.id
          );
        } else {
          return (
            date.end === day.fullDate &&
            date.costumer.id === day.costumerLeave.id
          );
        }
      })
    : [];
  if (dateFromDb) {
    dayInfo.value = dateFromDb;
    costumerInfoShow.value = true;
  }
};
const onCostumerInfoCardDelete = async () => {
  try {
    if (dayInfo.value) {
      const { data } = await app.$apiFetch<ICalendarDateData>(
        `/calendar-dates/${dayInfo.value.id}`,
        {
          method: "DELETE",
        }
      );
      if (data.id) {
        refreshCalendarDatesFromDb();
        costumerInfoShow.value = false;
      }
    }
  } catch (e) {
    console.error(e);
  }
};
// розібратись з тіпами які создають і в середині календаря підправити
const onSelectDates = (date: any) => {
  console.log(date);
  onShowCreateCostumerForm({
    ...date,
    start: date.start.fullDate,
    end: date.end.fullDate,
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
  costumerFromDb: boolean;
  user: ID;
  costumerId: ID;
  hotel: ID;
  enterprise: ID;
}) => {
  await onSubmitCreateForm({
    ...formCostumer,
    hotel: hotelId.value,
    // enterprise: user.value.enterprise.id,
    user: user.value.id,
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
</script>

<style lang="scss">
.costumer-card-form {
  width: 600px;
}
</style>
