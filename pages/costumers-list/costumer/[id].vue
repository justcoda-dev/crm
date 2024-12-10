<template>
  <v-card class="pa-4">
    <v-card-title>{{ costumer.name }}</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item-title>Готелі в яких бронювався:</v-list-item-title>
        <template v-for="hotel of costumer.hotels" :key="hotel.id">
          <v-list-item>{{ hotel.name }}</v-list-item>
        </template>
      </v-list>
      <v-list>
        <v-list-item-title>Користувач який забронював:</v-list-item-title>
        <v-list-item>{{ costumer.user.username }}</v-list-item>
      </v-list>
      <v-list>
        <v-list-item-title>Заброньовані дати:</v-list-item-title>
        <template
          v-for="calendar_date of costumer.calendar_dates"
          :key="calendar_date.id"
        >
          <v-list-item @click="onDateClick(calendar_date)"
            >{{ calendar_date.start }} - {{ calendar_date.end }}</v-list-item
          >
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import type { ICalendarDateFromDb } from "~/TS/ICalendarDate";

const app = useNuxtApp();
const route = useRoute();
const router = useRouter();
const costumerId = computed(() =>
  Array.isArray(route.params.id)
    ? parseInt(route.params.id[0])
    : parseInt(route.params.id)
);
const costumer = await app.$costumerService.getCostumerById(costumerId.value);

const onDateClick = async (calendarDate: ICalendarDateFromDb) => {
  const date = new Date(calendarDate.start);
  const { data: calendarDateFromDb } =
    await app.$calendarDateService.getCalendarDateById(calendarDate.id);

  router.push({
    path: `/hotel/${calendarDateFromDb.value?.data.hotel.id}`,
    query: { month: date.getMonth() + 1, year: date.getFullYear() },
  });
};
</script>
