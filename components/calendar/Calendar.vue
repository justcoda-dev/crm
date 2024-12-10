<template>
  <div class="d-flex flex-column align-center">
    <calendar-header
      class="calendar__header"
      @prevMonth="onPrevMonth"
      @nextMonth="onNextMonth"
    >
      {{ currMonth }}/{{ currYear }}
    </calendar-header>
    <calendar-month
      @onDayClick="onDayClick"
      @onReservedDayClick="onReservedDayClick"
      :days="calendarPageDates"
    ></calendar-month>
  </div>
</template>

<script lang="ts" setup>
// прикрутити телеграм бота треба, сервак

import { fullDateConvertor } from "~/functions/fullDateConvertor";
import type {
  ICalendarDateCreate,
  ICalendarDateFromDb,
} from "~/TS/ICalendarDate";

interface IProps {
  reservedDates?: ICalendarDateFromDb[];
  defaultDate?: any;
}
const props = defineProps<IProps>();
console.log(props.defaultDate);
const emit = defineEmits(["selectDates", "changeMonth", "onReservedDayClick"]);
const daysInWeek = 7;
const cellCount = 42;
const firstMonth = 1;
const lastMonth = 12;
const currDate = ref(new Date(props.defaultDate || Date.now()));
const currYear = ref(currDate.value.getFullYear());
const currMonth = ref(currDate.value.getMonth() + 1);

const selectedDatesInitial = {
  start: null,
  end: null,
};
//
const selectedDates = ref<{
  start: ICalendarDateCreate | null;
  end: ICalendarDateCreate | null;
}>({
  ...selectedDatesInitial,
});

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
    return {
      id: index,
      full_date,
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
    const selectedStartDateUTC = selectedStartDate.value.getTime();

    const disabledDatesBeforeSelected = calendarPageDatesWithState.value.filter(
      (date) => {
        const dateUTC = fullDateConvertor(date.full_date).getTime();

        if (selectedStartDateUTC > dateUTC && date.end_date) {
          return date;
        } else if (selectedDates.value.start?.end_date) {
          return date;
        }
      }
    );

    const disabledDatesAfterSelected = calendarPageDatesWithState.value.filter(
      (date) => {
        const dateUTC = fullDateConvertor(date.full_date).getTime();
        if (selectedStartDateUTC < dateUTC && date.start_date) {
          return date;
        }
        if (selectedDates.value.start?.start_date) {
          return date;
        }
      }
    );

    const prevUnavailableDate = Math.max(
      ...disabledDatesBeforeSelected.map(({ full_date }) => {
        const date = fullDateConvertor(full_date).getTime();
        if (date < selectedStartDateUTC) {
          return date;
        } else {
          return selectedStartDateUTC;
        }
      })
    );

    const nextUnavailableDate = Math.min(
      ...disabledDatesAfterSelected.map(({ full_date }) => {
        const date = fullDateConvertor(full_date).getTime();
        if (date > selectedStartDateUTC) {
          return date;
        } else {
          return selectedStartDateUTC;
        }
      })
    );

    return calendarPageDatesWithState.value.map((date) => {
      const dateUTC = fullDateConvertor(date.full_date).getTime();

      if (dateUTC < prevUnavailableDate || dateUTC > nextUnavailableDate) {
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
const onChangeMonth = () => {
  emit("changeMonth", { month: currMonth.value, year: currYear.value });
};
const onDayClick = (day: ICalendarDateCreate) => {
  if (!selectedStartDate.value) {
    selectedDates.value.start = day;
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
      })
    );
    clearDates();
  }
};
</script>
<style lang="scss" scoped></style>
