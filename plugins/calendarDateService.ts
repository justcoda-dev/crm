import type { ID } from "~/TS/myTypes";
import type {
  ICalendarCreateSelectedDates,
  ICalendarDateDataFromDb,
} from "~/TS/ICalendarDate";
import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type { IService } from "~/TS/IService";
export default defineNuxtPlugin((nuxtApp) => {
  const app = useNuxtApp();

  const calendarDateService: Omit<IService, "getData" | "updateDataById"> = {
    postData: async (selectedCalendarDates: ICalendarCreateSelectedDates) => {
      try {
        const { data } = await app.$apiFetch<ICalendarDateDataFromDb>(
          "/calendar-dates?pupulate=*",
          {
            method: "POST",
            body: {
              data: {
                ...selectedCalendarDates,
                start: selectedCalendarDates.start.full_date,
                end: selectedCalendarDates.end.full_date,
                filter_date: selectedCalendarDates.start.filter_date + "",
              },
            },
          }
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    getDataById: async (id: ID) => {
      try {
        const { data } = await app.$apiFetch<ICalendarDateDataFromDb>(
          `/calendar-dates/${id}?populate=*`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    deleteById: async (id: ID) => {
      try {
        const { data } = await app.$apiFetch<ICalendarDateDataFromDb>(
          `/calendar-dates/${id}`,
          {
            method: "DELETE",
          }
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    getDataByFilter: async <T>(ids: ID[] | ID, filterKey: string) => {
      try {
        return await app.$useApiFetch<T>(
          `/calendar-dates?${requestFiltersCreator(ids, filterKey)}&populate=*`
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };

  return {
    provide: {
      calendarDateService,
    },
  };
});
