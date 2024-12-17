import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type {
  IHotel,
  IHotelCreate,
  IHotelData,
  IHotelsData,
} from "~/TS/IHotel";
import type { IService } from "~/TS/IService";
import type { ID } from "~/TS/myTypes";

export default defineNuxtPlugin((nuxtApp) => {
  const app = useNuxtApp();

  const hotelService: Omit<IService, "deleteById"> = {
    getData: async () => {
      try {
        const { data } = await app.$apiFetch<IHotelsData>(`hotels?populate=*`);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getDataByFilter: async (ids: ID | ID[], filterKey: string = "users") => {
      try {
        const { data } = await app.$apiFetch<IHotelsData>(
          `hotels?${requestFiltersCreator(ids, filterKey)}&populate=*`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getDataById: async (userId: ID) => {
      try {
        const { data } = await app.$apiFetch<IHotelsData>(
          `hotels?filters[users]=${userId}&populate=*`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    postData: async (hotel: IHotelCreate) => {
      try {
        const { data } = await app.$apiFetch<IHotelData>(`hotels`, {
          method: "POST",
          body: {
            data: hotel,
          },
        });
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    updateDataById: async (id: ID, hotel: IHotel) => {
      try {
        const { data } = await app.$apiFetch<IHotelData>(`hotels/${id}`, {
          method: "PUT",
          body: {
            data: hotel,
          },
        });
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };

  return {
    provide: {
      hotelService,
    },
  };
});
