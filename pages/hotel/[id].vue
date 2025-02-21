<template>
  <div class="calendar h-100">
    <Calendar
      class="pa-1"
      :reserved-dates="reservedDates"
      :default-date="defaultDate"
      :price="{
        weekday_price: weekDaysPrice,
        weekend_price: weekEndsPrice,
      }"
      @select-dates="onSelectDates"
      @change-month="onChangeMonth"
      @on-reserved-day-click="onReservedDayClick"
    ></Calendar>
  </div>
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
import { useCalendar } from "~/composable/useCalendar";
import { useDialog } from "~/composable/useDialog";
import { useStatus } from "~/composable/useStatus";
import { useForm } from "~/composable/useForm";

const app = useNuxtApp();
const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const status = useStatus();

const { addSelectedDates } = useCalendar();
const { submitForm: submitCreateCostumerForm, update: updateCostumer } =
  useForm(app.$costumerService);

const { user } = storeToRefs(useMyUserStore());
const defaultDate = ref(
  route.query.month
    ? new Date(`${route.query.year}- ${route.query.month}`)
    : new Date()
);
const price = await app.$settingService.getDataByFilter({ key: "price" });

const weekDaysPrice = computed(() =>
  parseInt(price.find((item) => item.key === "weekday").value)
);
const weekEndsPrice = computed(() =>
  parseInt(price.find((item) => item.key === "weekend").value)
);

const selectedHotelId = computed(() =>
  !Array.isArray(route.params.id)
    ? parseInt(route.params.id)
    : parseInt(route.params.id[0])
);
const selectedHotelRoomId = computed(() => {
  if (route.query.hotelRoomId) {
    return !Array.isArray(route.query.hotelRoomId)
      ? parseInt(route.query.hotelRoomId)
      : parseInt(route.query.hotelRoomId[0]);
  } else {
    return null;
  }
});

const { data: reservedDatesData, refresh: refreshCalendarDatesFromDb } =
  await useAsyncData(
    async () =>
      await app.$calendarDateService.getDataByFilter({
        hotel_room: selectedHotelRoomId.value,
        hotel: selectedHotelId.value,
      }),
    {
      watch: [selectedHotelRoomId],
    }
  );

const reservedDates = computed(() => {
  if (reservedDatesData.value) {
    return reservedDatesData.value;
  } else {
    return undefined;
  }
});

const onChangeMonth = (date: { year: number; month: number }) => {
  router.push({ query: { ...route.query, ...date } });
};

const onReservedDayClick = (
  day: ICalendarDateCreate & { [key: string]: any },
  type: string
) => {
  const reservedDate = reservedDates.value?.filter(
    (date: any) => date.start === day.full_date || date.end === day.full_date
  )[0];

  const reservedDateId = reservedDate?.id;
  dialog.showComponent({
    componentToShow: defineAsyncComponent(
      () => import("@/components/cards/CostumerInfoCard.vue")
    ),
    props: { costumer: day[type], costumerDate: reservedDate },
    events: {
      onDelete: () => {
        dialog.showComponent({
          componentToShow: defineAsyncComponent(
            () => import("@/components/forms/ConfirmForm.vue")
          ),
          props: {
            text: `Видалити бронювання з ${reservedDate?.start} по ${reservedDate?.end} ?`,
          },
          events: {
            onSubmit: async () => {
              try {
                if (reservedDateId) {
                  await app.$calendarDateService.deleteById(reservedDateId);
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
  dialog.showComponent({
    componentToShow: defineAsyncComponent(
      () => import("@/components/forms/CreateCostumerForm.vue")
    ),
    props: {},
    events: {
      submitClick: async (costumer: ICostumerCreate) => {
        try {
          if (
            user.value &&
            selectedHotelRoomId.value &&
            calendarSelectedDates
          ) {
            const createdCostumer = await submitCreateCostumerForm({
              ...costumer,
              user: user.value.id,
              hotels: selectedHotelId.value,
            });

            const createdDate = await addSelectedDates({
              ...calendarSelectedDates,
              hotel_room: selectedHotelRoomId.value,
              hotel: selectedHotelId.value,
              user: user.value.id,
              costumer: createdCostumer.id,
            });

            if (createdCostumer && createdDate) {
              await updateCostumer(
                {
                  user: user.value.id,
                  hotels: [...createdCostumer.hotels, selectedHotelId.value],
                  hotel_rooms: [
                    ...createdCostumer.hotel_rooms,
                    selectedHotelRoomId.value,
                  ],
                  calendar_dates: [
                    ...createdCostumer.calendar_dates,
                    createdDate.id,
                  ],
                },
                createdCostumer.id
              );

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
          ...route.query,
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
.calendar {
}
.costumer-card-form {
  width: 600px;
}
</style>
