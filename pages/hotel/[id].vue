<template>
  <v-container class="py-4">
    <Calendar
      :reserved-dates="reservedDates"
      :default-date="defaultDate"
      @select-dates="onSelectDates"
      @change-month="onChangeMonth"
      @on-reserved-day-click="onReservedDayClick"
    ></Calendar>
  </v-container>
</template>

<script lang="ts" setup>
import Calendar from "../../components/calendar/Calendar.vue";

import type {
  ICalendarDateCreate,
  ICalendarCreateSelectedDates,
} from "~/TS/ICalendarDate";
import type { ICostumerCreate } from "~/TS/ICostumer";

import { useRoute } from "vue-router";
import { useMyUserStore } from "~/store/user";
import CreateCostumerForm from "~/components/forms/CreateCostumerForm.vue";
import CostumerInfoCard from "~/components/cards/CostumerInfoCard.vue";
import { useCreateCostumerForm } from "~/composable/useCreateCostumerForm";
import { useCalendar } from "~/composable/useCalendar";
import { useDialog } from "~/composable/useDialog";
import { useStatus } from "~/composable/useStatus";
import ConfirmForm from "~/components/forms/ConfirmForm.vue";

const app = useNuxtApp();
const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const status = useStatus();
const { addSelectedDates } = useCalendar();
const { createCostumer, addRelationsToCostumer } = useCreateCostumerForm();

const { user } = storeToRefs(useMyUserStore());
const defaultDate = ref(
  route.query.month
    ? new Date(`${route.query.year}- ${route.query.month}`)
    : new Date()
);

const reservedDates = computed(() => {
  if (reservedDatesData.value) {
    return reservedDatesData.value.data;
  } else {
    return undefined;
  }
});

const selectedHotelId = computed(() =>
  !Array.isArray(route.params.id)
    ? parseInt(route.params.id)
    : parseInt(route.params.id[0])
);

const { data: reservedDatesData, refresh: refreshCalendarDatesFromDb } =
  await app.$calendarDateService.getCalendarDatesByHotelIdServer(
    selectedHotelId.value
  );

const onChangeMonth = (date: { year: number; month: number }) => {
  router.push({ query: { ...date } });
};

const onReservedDayClick = (
  day: ICalendarDateCreate & { [key: string]: any },
  type: string
) => {
  const reservedDate = reservedDates.value?.filter(
    (date) => date.start === day.full_date || date.end === day.full_date
  )[0];
  console.log(reservedDate);
  const reservedDateId = reservedDate?.id;
  dialog.showComponent({
    componentToShow: CostumerInfoCard,
    props: { costumer: day[type], costumerDate: reservedDate },
    events: {
      onDelete: () => {
        dialog.showComponent({
          componentToShow: ConfirmForm,
          props: {
            text: `Видалити бронювання з ${reservedDate?.start} по ${reservedDate?.end} ?`,
          },
          events: {
            onSubmit: async () => {
              try {
                if (reservedDateId) {
                  await app.$calendarDateService.deleteCalendarDateById(
                    reservedDateId
                  );
                  status.showStatus({
                    status: `Дату успішно видалено`,
                    type: "success",
                  });
                }
                refreshCalendarDatesFromDb();
                dialog.hideComponent();
              } catch (e) {
                console.error(e);
                status.showStatus({
                  status: `При видаленні сталась помилка :(`,
                  type: "error",
                });
                dialog.hideComponent();
              }
            },
            onCancel: () => {
              dialog.hideComponent();
            },
          },
        });
      },
      onCancel: () => {
        dialog.hideComponent();
      },
    },
  });
};

const onSelectDates = async (
  calendarSelectedDates: ICalendarCreateSelectedDates
) => {
  console.log(calendarSelectedDates);
  dialog.showComponent({
    componentToShow: CreateCostumerForm,
    props: {},
    events: {
      submitClick: async (costumer: ICostumerCreate) => {
        try {
          if (user.value && selectedHotelId.value && calendarSelectedDates) {
            const [createdDate, createdCostumer] = await Promise.all([
              addSelectedDates({
                ...calendarSelectedDates,
                hotel: selectedHotelId.value,
                user: user.value.id,
              }),
              createCostumer({
                ...costumer,
                user: user.value.id,
                hotels: selectedHotelId.value,
              }),
            ]);
            if (createdCostumer && createdDate) {
              await addRelationsToCostumer({
                id: createdCostumer.id,
                user: user.value.id,
                hotels: [...createdCostumer.hotels, selectedHotelId.value],
                calendar_dates: [
                  ...createdCostumer.calendar_dates,
                  createdDate.id,
                ],
              });

              refreshCalendarDatesFromDb();
              dialog.dialogState.value = false;
              status.showStatus({
                status: `${createdCostumer.name} успішно заброньовано`,
                type: "success",
              });
            }
          }
        } catch (e) {
          status.showStatus({
            status: `Під час бронювання виникла помилка :(`,
            type: "error",
          });
          dialog.dialogState.value = false;
        }
      },
      cancelClick: () => {
        dialog.dialogState.value = false;
      },
    },
  });
};

watch(
  () => route,
  (route) => {
    if (!route.query.month) {
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
