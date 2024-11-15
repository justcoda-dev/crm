<template>
  <div class="calendar">
    <calendar-header @prevMonth="onPrevMonth" @nextMonth="onNextMonth">
      {{ currMonth }}
      {{ currYear }}
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
// first and last dates shouldnt be disabled
import { fullDateConvertor } from "~/functions/fullDateConvertor";
import type { IDay } from "~/TS/Calendar";
interface IProps {
  reservedDates?: any[];
  defaultDate?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(["selectDates", "changeMonth", "onReservedDayClick"]);
const daysInWeek = 7;
const cellCount = 42;
const firstMonth = 1;
const lastMonth = 12;
const date = ref(new Date(props.defaultDate || Date.now()));
const currYear = ref(date.value.getFullYear());
const currMonth = ref(date.value.getMonth() + 1);

const selectedDatesInitial = {
  start: null,
  end: null,
};

const selectedDates = ref<{ start: IDay | null; end: IDay | null }>({
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
  const datesArr = Array.from({ length: lastDayOfMonth.value }, (_, i) => {
    return {
      day: i + 1,
      year,
      month,
    };
  });

  const numberOfFirstDayInOrder =
    firstDayOfMonth.value === 0 ? daysInWeek : firstDayOfMonth.value;

  for (let i = 0; i < numberOfFirstDayInOrder - 1; i++) {
    datesArr.unshift({
      day: lastDaysOfPrevMonth.value - i,
      year: month > 1 ? year : year - 1,
      month: month > 1 ? month - 1 : lastMonth,
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
    });
  }
  return datesArr.map(({ day, year, month }, index) => {
    const fullDate = `${year}-${month}-${day}`;
    return {
      day,
      year,
      month,
      fullDate,
      index,
    };
  });
});

const calendarPageDatesWithState = computed(() => {
  const datesWithState: IDay[] = initialCalendarPageDates.value.map((date) => {
    const calendarDate = new Date(
      date.year,
      date.month - 1,
      date.day
    ).getTime();

    const selected =
      calendarDate === selectedStartDate.value?.getTime() ||
      calendarDate === selectedEndDate.value?.getTime();

    const stateStatusFromDb = props.reservedDates?.reduce(
      (acc, currentDate) => {
        const startDateFromDb = fullDateConvertor(
          currentDate.attributes.start
        ).getTime();

        const endDateFromDb = fullDateConvertor(
          currentDate.attributes.end
        ).getTime();

        const reserved =
          calendarDate >= startDateFromDb && calendarDate <= endDateFromDb;
        const startDate = calendarDate === startDateFromDb;
        const endDate = calendarDate === endDateFromDb;
        const disabled = reserved && !startDate && !endDate;

        return {
          startDate: startDate || acc.startDate,
          endDate: endDate || acc.endDate,
          reserved: reserved || acc.reserved,
          disabled: disabled || acc.disabled,
          costumer:
            currentDate.attributes.costumer.data.attributes ||
            acc.attributes.costumer.data.attributes,
        };
      },
      {
        reserved: false,
        startDate: false,
        endDate: false,
        disabled: false,
        costumer: {},
      }
    );
    return {
      ...date,
      ...stateStatusFromDb,
      selected,
    };
  });
  return datesWithState;
});
console.log(calendarPageDatesWithState);
const calendarPageDates = computed(() => {
  if (selectedStartDate.value) {
    const selectedStartDateUTC = selectedStartDate.value.getTime();

    const disabledDatesBeforeSelected = calendarPageDatesWithState.value.filter(
      (date) => {
        const dateUTC = fullDateConvertor(date.fullDate).getTime();
        if (date.startDate || date.endDate) {
          if (selectedStartDateUTC > dateUTC) {
            return date;
          }
        }
      }
    );

    const disabledDatesAfterSelected = calendarPageDatesWithState.value.filter(
      (date) => {
        const dateUTC = fullDateConvertor(date.fullDate).getTime();
        if (date.startDate || date.endDate) {
          if (selectedStartDateUTC < dateUTC) {
            return date;
          }
        }
      }
    );

    const prevUnavailableDate = Math.max(
      ...disabledDatesBeforeSelected.map(({ fullDate }) => {
        const date = fullDateConvertor(fullDate).getTime();
        if (date < selectedStartDateUTC) {
          return date;
        } else {
          return selectedStartDateUTC;
        }
      })
    );

    const nextUnavailableDate = Math.min(
      ...disabledDatesAfterSelected.map(({ fullDate }) => {
        const date = fullDateConvertor(fullDate).getTime();
        if (date > selectedStartDateUTC) {
          return date;
        } else {
          return selectedStartDateUTC;
        }
      })
    );

    return calendarPageDatesWithState.value.map((date) => {
      const dateUTC = fullDateConvertor(date.fullDate).getTime();

      if (dateUTC <= prevUnavailableDate || dateUTC >= nextUnavailableDate) {
        return { ...date, disabled: true };
      } else {
        return date;
      }
    });
  } else {
    return calendarPageDatesWithState.value;
  }
});

watch(
  () => calendarPageDates.value,
  (value) => {}
);
const onPrevMonth = () => {
  if (currMonth.value > 1) {
    currMonth.value = currMonth.value - 1;
  } else {
    currMonth.value = lastMonth;
    currYear.value = currYear.value - 1;
  }
};
const onNextMonth = () => {
  if (currMonth.value < lastMonth) {
    currMonth.value = currMonth.value + 1;
  } else {
    currMonth.value = firstMonth;
    currYear.value = currYear.value + 1;
  }
};
const onChangeMonth = () => {
  emit("changeMonth", { month: currMonth.value, year: currYear.value });
};
const onDayClick = (day: IDay) => {
  if (!selectedStartDate.value) {
    selectedDates.value.start = day;
  } else {
    selectedDates.value.end = day;
    onSelectDates();
  }
};
const onReservedDayClick = (day: IDay) => {
  emit("onReservedDayClick", day);
};
const clearDates = () => {
  selectedDates.value = { ...selectedDatesInitial };
};

const onSelectDates = () => {
  console.log("before");
  if (selectedStartDate.value && selectedEndDate.value) {
    console.log("after");
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
        filter_date: selectedDates.value.start?.year.toString(),
      })
    );
    clearDates();
  }
};

watch(
  () => currMonth.value,
  () => {
    onChangeMonth();
  }
);
</script>

<style lang="scss">
.calendar {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
