<template>
  <v-container class="py-4">
    <custom-calendar
      @selectDate="onShowCreateCostumerForm"
      @changeMonth="onChangeMonth"
      :calendarList="mapCalendarDates"
      :currentPrice="mapCurrentPrice"
    >
      <template #menu-reserved="{ attribute }">
        <menu-mobile
          v-if="mobile"
          :attribute="attribute"
          @delete="onDeleteReservedMenu"
          @edit="onShowEditCostumerForm"
        />

        <menu-calendar-reserved
          v-else
          :attribute="attribute"
          @delete="onDeleteReservedMenu"
          @edit="onShowEditCostumerForm"
        />
      </template>
    </custom-calendar>

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
    <v-dialog class="dialog" v-else v-model="showCreateCostumerForm">
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
  </v-container>
</template>
<script lang="ts" setup>
import CustomCalendar from "../../components/calendar/CustomCalendar.vue";
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue";
import MenuCalendarReserved from "../../components/menus/MenuCalendarReserved.vue";
import EditCostumerForm from "../../components/forms/EditCostumerForm.vue";
import MenuMobile from "../../components/menus/MenuMobile.vue";
import MobileDialog from "../../components/dialog/MobileDialog.vue";
import { useCreateCostumerForm } from "~/composable/useCreateCostumerForm";
import { useMyMobileStore } from "~/store/mobile";
import { useRoute } from "vue-router";
import type { IcurrentPrices } from "~/TS/ICurrentPrice";
import type { ICalendarDate, ICalendarDates } from "~/TS/ICalendarDate";
import type { ID } from "~/TS/myTypes";
import { useEditCostumerForm } from "~/composable/useEditCostumerForm";
import { useMyUserStore } from "~/store/user";

const app = useNuxtApp();
const route = useRoute();
const router = useRouter();
const { mobile } = storeToRefs(useMyMobileStore());
const { user } = storeToRefs(useMyUserStore());
const showMenu = ref(false);

const { data: currentPriceFromDb } = await app.$useApiFetch(
  () => "/options/4?populate=*"
);

const { data: calendarDatesFromDb, refresh: refreshCalendarDatesFromDb } =
  await app.$useApiFetch<ICalendarDates>(
    () =>
      `/calendar-dates?populate=*&filters[filter_date][$startsWith]=${route.query.month}`
  );

const createCalendarMonthInitial = computed(() => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const fullYear = date.getFullYear();
  return `${fullYear}-${month < 10 ? "0" + month : month}`;
});

const mapCurrentPrice = computed(() => {
  if (currentPriceFromDb.value?.data) {
    return currentPriceFromDb.value.data.attributes.text_option.reduce(
      (prev, curr) => {
        return {
          ...prev,
          [curr.title]: curr.value,
        };
      },
      {}
    );
  }
  return {};
});

const mapCalendarDates = computed(() => {
  if (calendarDatesFromDb.value) {
    return calendarDatesFromDb.value.data.map((date: ICalendarDate) => {
      return {
        key: date.id,
        dates: {
          start: date.attributes.start,
          end: date.attributes.end,
        },
        customData: {
          ...date.attributes.costumer.data,
          total_price: date.attributes.total_price,
        },
      };
    });
  } else {
    return [];
  }
});

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

const onChangeMonth = (month: string) => {
  router.push({ query: { month } });
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
  () => route.query.month,
  (month) => {
    if (!month && route.path === "/calendar") {
      router.push({ query: { month: createCalendarMonthInitial.value } });
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.costumer-card-form {
  max-width: 500px;
}
.v-overlay {
  .v-overlay__content {
    background-color: black;
    align-items: center;
  }
}
.v-overlay__content {
  background-color: black;
  align-items: center;
}
</style>
