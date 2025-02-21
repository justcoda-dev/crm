import type { ICalendarCreateSelectedDates } from "~/TS/ICalendarDate";
import type { ID } from "~/TS/myTypes";

export const useCalendar = () => {
  const app = useNuxtApp();

  const loading = ref<boolean>();

  const addSelectedDates = async (
    selectedCalendarDates: ICalendarCreateSelectedDates & {
      user: ID;
      hotel: ID;
      costumer: ID;
    }
  ) => {
    try {
      loading.value = true;
      const data = await app.$calendarDateService.postData(
        selectedCalendarDates
      );
      loading.value = false;
      return data;
    } catch (error) {
      console.error("use calendar error", error);
      loading.value = false;
      throw error;
    }
  };

  return {
    addSelectedDates,
    loading,
  };
};
