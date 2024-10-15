<template>
  <div class="calendar">
    <calendar-header @prevMounth="onPrevMounth" @nextMounth="onNextMounth">
      {{ currMounth }}
      {{ currYear }}
    </calendar-header>
    <calendar-mounth
      @onDayClick="onDayClick"
      :days="calendarMounthDays"
    ></calendar-mounth>
  </div>
</template>

<script lang="ts" setup>
// прикрутити телеграм бота треба, сервак
import type { IDay } from "~/TS/Calendar";
const emit = defineEmits(["selectDates"]);
const daysInWeek = 7;
const cellCount = 42;
const firstMounth = 1;
const lastMounth = 12;
const date = ref(new Date());
const currYear = ref(date.value.getFullYear());
const currMounth = ref(date.value.getMonth() + 1);
const selectedStatus = ref({
  firstDateSelected: false,
  secondDateSelected: false,
});
const selectedDates = ref<{ start: IDay | null; end: IDay | null }>({
  start: null,
  end: null,
});

const dayOfWeek = computed(() =>
  new Date(currYear.value, currMounth.value - 1, 1).getDay()
);

const lastDayOfMounth = computed(() =>
  new Date(currYear.value, currMounth.value, 0).getDate()
);

const lastDaysOfPrevMonth = computed(() =>
  new Date(currYear.value, currMounth.value - 1, 0).getDate()
);
const freeCellCount = computed(() => cellCount - lastDayOfMounth.value);
const startIndex = ref();
const endIndex = ref();

const calendarMounthDays = computed(() => {
  let arr = Array.from({ length: lastDayOfMounth.value }, (_, i) => {
    return {
      day: i + 1,
      year: currYear.value,
      mounth: currMounth.value,
    };
  });

  let numberOfWeekDayInOrder =
    dayOfWeek.value === 0 ? daysInWeek : dayOfWeek.value;
  for (let i = 0; i < numberOfWeekDayInOrder - 1; i++) {
    arr.unshift({
      day: lastDaysOfPrevMonth.value - i,
      year: currMounth.value > 1 ? currYear.value : currYear.value - 1,
      mounth: currMounth.value > 1 ? currMounth.value - 1 : lastMounth,
    });
  }
  for (
    let i = 0;
    i < cellCount - (lastDayOfMounth.value + (numberOfWeekDayInOrder - 1));
    i++
  ) {
    arr.push({
      day: i + 1,
      year: currMounth.value < lastMounth ? currYear.value : currYear.value + 1,
      mounth:
        currMounth.value < lastMounth ? currMounth.value + 1 : firstMounth,
    });
  }
  const start = selectedDates.value.start;
  const end = selectedDates.value.end;

  const res = arr.map(({ day, mounth, year }, index) => {
    const dayWithSelectedFlag = { day, mounth, year, selected: false };
    const stringDay = `${day}${mounth}${year}`;
    const stringStart = start
      ? `${start.day}${start.mounth}${start.year}`
      : null;
    const stringEnd = end ? `${end.day}${end.mounth}${end.year}` : null;

    if (stringDay === stringStart) {
      dayWithSelectedFlag.selected = true;
      startIndex.value = index;
    } else if (stringDay === stringEnd) {
      dayWithSelectedFlag.selected = true;
      endIndex.value = index;
    } else {
      dayWithSelectedFlag.selected = false;
    }

    return dayWithSelectedFlag;
  });

  return res;
});

const onPrevMounth = () => {
  if (currMounth.value > 1) {
    currMounth.value = currMounth.value - 1;
  } else {
    currMounth.value = lastMounth;
    currYear.value = currYear.value - 1;
  }
};
const onNextMounth = () => {
  if (currMounth.value < lastMounth) {
    currMounth.value = currMounth.value + 1;
  } else {
    currMounth.value = firstMounth;
    currYear.value = currYear.value + 1;
  }
};
const onDayClick = (day: IDay) => {
  if (selectedStatus.value.secondDateSelected) {
    selectedStatus.value.firstDateSelected = false;
    selectedStatus.value.secondDateSelected = false;
    clearDates();
  }

  if (!selectedStatus.value.firstDateSelected) {
    selectedDates.value.start = day;
    selectedStatus.value.firstDateSelected = true;
  } else {
    selectedDates.value.end = day;
    selectedStatus.value.secondDateSelected = true;
    const start = selectedDates.value.start;
    const end = selectedDates.value.end;
    if (start && end) {
      const startDate = new Date(start.year, start.mounth - 1, start.day);
      const endDate = new Date(end.year, end.mounth - 1, end.day);

      if (startDate > endDate) {
        selectedDates.value.start = end;
        selectedDates.value.end = start;
      }
      onSelectDates();
    }
  }
};

const clearDates = () => {
  selectedDates.value = {
    start: null,
    end: null,
  };
};

const onSelectDates = () => {
  emit("selectDates", toRaw(selectedDates.value));
};
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
