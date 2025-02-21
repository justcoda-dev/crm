<template>
  <div
    class="calendar h-100 d-flex flex-column align-center"
    :style="{ height: height + 'px', background: '#fff' }"
  >
    <calendar-header @prevMonth="onPrevMonth" @nextMonth="onNextMonth">
      <span style="opacity: 0.87"> {{ currMonth }}/{{ currYear }}</span>
    </calendar-header>
    <calendar-month
      @onDayClick="onDayClick"
      @onReservedDayClick="onReservedDayClick"
      :days="calendarPageDates"
    ></calendar-month>
  </div>
</template>

<script lang="ts" setup>
import { fullDateConvertor } from "~/functions/fullDateConvertor";
import type {
  ICalendarDateCreate,
  ICalendarDateFromDb,
} from "~/TS/ICalendarDate";

interface IProps {
  reservedDates?: ICalendarDateFromDb[];
  defaultDate?: any;
  price: {
    weekend_price: number;
    weekday_price: number;
  };
}
const props = defineProps<IProps>();

const emit = defineEmits(["selectDates", "changeMonth", "onReservedDayClick"]);
const selectedDatesInitial = {
  start: null,
  end: null,
};
const daysInWeek = 7;
const cellCount = 42;
const firstMonth = 1;
const lastMonth = 12;
const currDate = ref(new Date(props.defaultDate || Date.now()));
const currYear = ref(currDate.value.getFullYear());
const currMonth = ref(currDate.value.getMonth() + 1);
const height = ref();

const selectedDates = ref<{
  start: ICalendarDateCreate | null;
  end: ICalendarDateCreate | null;
}>({
  ...selectedDatesInitial,
});
const reservedDateBeforeSelected = ref();
const reservedDateAfterSelected = ref();

const selectedStartDate = computed(() => {
  if (selectedDates.value.start) {
    return new Date(
      selectedDates.value.start.year,
      selectedDates.value.start.month - 1,
      selectedDates.value.start.day
    );
  } else {
    return null;
  }
});

const selectedEndDate = computed(() => {
  if (selectedDates.value.end) {
    return new Date(
      selectedDates.value.end.year,
      selectedDates.value.end.month - 1,
      selectedDates.value.end.day
    );
  } else {
    return null;
  }
});

const firstDayOfMonth = computed(() =>
  new Date(currYear.value, currMonth.value - 1, 1).getDay()
);
const lastDayOfMonth = computed(() =>
  new Date(currYear.value, currMonth.value, 0).getDate()
);

const lastDaysOfPrevMonth = computed(() =>
  new Date(currYear.value, currMonth.value - 1, 0).getDate()
);

const daysCount = computed(() => {
  if (selectedStartDate.value && selectedEndDate.value) {
    const daysDifference =
      selectedEndDate.value.getTime() - selectedStartDate.value.getTime();
    return Math.ceil(daysDifference / (1000 * 60 * 60 * 24));
  } else {
    return null;
  }
});

const totalPrice = computed(() => {
  if (
    selectedStartDate.value &&
    selectedEndDate.value &&
    daysCount.value &&
    props.price
  ) {
    const daysArr = selectedStartDate.value
      ? Array.from({ length: daysCount.value }, (_, i) =>
          selectedStartDate.value ? selectedStartDate.value.getDay() + i : 0
        )
      : [];

    const totalPrice = daysArr.reduce((prev, curr) => {
      if (curr === 5 || curr === 6) {
        prev += props.price.weekend_price; // Вихідні
      } else {
        prev += props.price.weekday_price; // Будні
      }
      return prev;
    }, 0);

    return totalPrice;
  } else {
    return 0;
  }
});

const initialCalendarPageDates = computed(() => {
  const year = currYear.value;
  const month = currMonth.value;
  const filter_date = currYear.value;
  const datesArr = Array.from({ length: lastDayOfMonth.value }, (_, i) => {
    return {
      day: i + 1,
      year,
      month,
      filter_date,
    };
  });

  const numberOfFirstDayInOrder =
    firstDayOfMonth.value === 0 ? daysInWeek : firstDayOfMonth.value;

  for (let i = 0; i < numberOfFirstDayInOrder - 1; i++) {
    datesArr.unshift({
      day: lastDaysOfPrevMonth.value - i,
      year: month > 1 ? year : year - 1,
      month: month > 1 ? month - 1 : lastMonth,
      filter_date: month > 1 ? year : year - 1,
    });
  }
  for (
    let i = 0;
    i < cellCount - (lastDayOfMonth.value + (numberOfFirstDayInOrder - 1));
    i++
  ) {
    datesArr.push({
      day: i + 1,
      year: month < lastMonth ? year : year + 1,
      month: month < lastMonth ? month + 1 : firstMonth,
      filter_date: month > 1 ? year : year - 1,
    });
  }
  return datesArr.map((date, index) => {
    const full_date = `${date.year}-${date.month}-${date.day}`;
    const day_number = new Date(full_date).getDay();
    return {
      id: index,
      full_date,
      day_number,
      ...date,
    };
  });
});

const calendarPageDatesWithState = computed(() => {
  const datesWithState = initialCalendarPageDates.value.map((date) => {
    const calendarDate = new Date(
      date.year,
      date.month - 1,
      date.day
    ).getTime();

    const selected =
      calendarDate === selectedStartDate.value?.getTime() ||
      calendarDate === selectedEndDate.value?.getTime();

    const stateStatusInitial = {
      reserved: false,
      start_date: false,
      end_date: false,
      disabled: false,
      costumer_enter: {},
      costumer_leave: {},
    };

    const stateStatusFromDb = props.reservedDates?.reduce(
      (acc, currentDate) => {
        const startDateFromDb = fullDateConvertor(currentDate.start).getTime();
        const endDateFromDb = fullDateConvertor(currentDate.end).getTime();

        const reserved =
          calendarDate >= startDateFromDb && calendarDate <= endDateFromDb;
        const startDate = calendarDate === startDateFromDb;
        const endDate = calendarDate === endDateFromDb;
        const disabled = reserved && !startDate && !endDate;

        return {
          start_date: startDate || acc.start_date,
          end_date: endDate || acc.end_date,
          reserved: reserved || acc.reserved,
          disabled: disabled || acc.disabled,
          costumer_enter: startDate ? currentDate.costumer : acc.costumer_enter,
          costumer_leave: endDate ? currentDate.costumer : acc.costumer_leave,
        };
      },
      stateStatusInitial
    );
    return {
      ...date,
      ...(stateStatusFromDb ? stateStatusFromDb : stateStatusInitial),
      selected,
    };
  });
  return datesWithState;
});

const calendarPageDates = computed(() => {
  if (selectedStartDate.value) {
    return calendarPageDatesWithState.value.map((date) => {
      const dateUTC = fullDateConvertor(date.full_date).getTime();
      if (
        (dateUTC < reservedDateBeforeSelected.value &&
          reservedDateBeforeSelected.value !== null) ||
        (dateUTC > reservedDateAfterSelected.value &&
          reservedDateAfterSelected.value !== null)
      ) {
        return { ...date, disabled: true };
      } else {
        return date;
      }
    });
  } else {
    return calendarPageDatesWithState.value;
  }
});

const onPrevMonth = () => {
  if (currMonth.value > 1) {
    currMonth.value = currMonth.value - 1;
  } else {
    currMonth.value = lastMonth;
    currYear.value = currYear.value - 1;
  }
  onChangeMonth();
};
const onNextMonth = () => {
  if (currMonth.value < lastMonth) {
    currMonth.value = currMonth.value + 1;
  } else {
    currMonth.value = firstMonth;
    currYear.value = currYear.value + 1;
  }

  onChangeMonth();
};
const setBeforeAndAfterReservedDates = () => {
  if (!reservedDateBeforeSelected.value && selectedStartDate.value) {
    const selectedStartDateUTC = selectedStartDate.value.getTime();
    const reservedDatesBeforeSelected = calendarPageDatesWithState.value.filter(
      (date) => {
        const dateUTC = fullDateConvertor(date.full_date).getTime();
        if (selectedStartDateUTC >= dateUTC && date.end_date) {
          return date;
        }
      }
    );
    reservedDateBeforeSelected.value = reservedDatesBeforeSelected.length
      ? Math.max(
          ...reservedDatesBeforeSelected.map((date) =>
            fullDateConvertor(date.full_date).getTime()
          )
        )
      : null;
  }
  if (!reservedDateAfterSelected.value && selectedStartDate.value) {
    const selectedStartDateUTC = selectedStartDate.value.getTime();
    const reservedDatesAfterSelected = calendarPageDatesWithState.value.filter(
      (date) => {
        const dateUTC = fullDateConvertor(date.full_date).getTime();
        if (selectedStartDateUTC <= dateUTC && date.start_date) {
          return date;
        }
      }
    );
    reservedDateAfterSelected.value = reservedDatesAfterSelected.length
      ? Math.min(
          ...reservedDatesAfterSelected.map((date) =>
            fullDateConvertor(date.full_date).getTime()
          )
        )
      : null;
  }
};

const onChangeMonth = () => {
  emit("changeMonth", { month: currMonth.value, year: currYear.value });
  setBeforeAndAfterReservedDates();
};
const onDayClick = (day: ICalendarDateCreate) => {
  if (!selectedStartDate.value) {
    selectedDates.value.start = day;
    console.log(selectedStartDate.value);
    reservedDateBeforeSelected.value = null;
    reservedDateAfterSelected.value = null;
    setBeforeAndAfterReservedDates();
  } else {
    selectedDates.value.end = day;
    onSelectDates();
  }
};
const onReservedDayClick = (day: ICalendarDateCreate, type: string) => {
  emit("onReservedDayClick", day, type);
};
const clearDates = () => {
  selectedDates.value = { ...selectedDatesInitial };
};

const onSelectDates = () => {
  if (selectedStartDate.value && selectedEndDate.value) {
    if (selectedStartDate.value > selectedEndDate.value) {
      const start = selectedDates.value.start;
      const end = selectedDates.value.end;
      selectedDates.value.start = end;
      selectedDates.value.end = start;
    }
    emit(
      "selectDates",
      toRaw({
        ...selectedDates.value,
        days_count: daysCount.value,
        total_price: totalPrice.value,
      })
    );
    clearDates();
  }
};
</script>
<style lang="scss" scoped>
.calendar {
  color: #3b4651;
}
</style>
