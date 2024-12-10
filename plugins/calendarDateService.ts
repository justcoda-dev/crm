import type { ID } from "~/TS/myTypes";
import type {
  ICalendarCreateSelectedDates,
  ICalendarDateDataFromDb,
  ICalendarDateFromDb,
  ICalendarDates,
} from "~/TS/ICalendarDate";
import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
export default defineNuxtPlugin((nuxtApp) => {
  const calendarDateService = () => {};
  const app = useNuxtApp();
  calendarDateService.postSelectedCalendarDates = async (
    selectedCalendarDates: ICalendarCreateSelectedDates
  ) => {
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
  };
  calendarDateService.getCalendarDateById = async (id: ID) => {
    try {
      return await app.$useApiFetch<ICalendarDateDataFromDb>(
        () => `/calendar-dates/${id}?populate=*`
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  calendarDateService.getCalendarDatesByHotelIdServer = async (id: ID) => {
    try {
      return await app.$useApiFetch<ICalendarDates>(
        () => `/calendar-dates?filters[hotel]=${id}&populate=*`
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  calendarDateService.getCalendarDatesByCostumerIdServer = async (id: ID) => {
    try {
      return await app.$useApiFetch<ICalendarDates>(
        () => `/calendar-dates?filters[costumer]=${id}&populate=*`
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  calendarDateService.deleteCalendarDateById = async (id: ID) => {
    try {
      return await app.$apiFetch<ICalendarDateDataFromDb>(
        `/calendar-dates/${id}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  calendarDateService.getCalendarDatesFilteredByIds = async <T>(
    ids: ID[],
    filter: string
  ) => {
    try {
      return await app.$apiFetch<T>(
        `/calendar-dates?${requestFiltersCreator(ids, filter)}`
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    provide: {
      calendarDateService,
    },
  };
});
