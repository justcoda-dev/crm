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

  const hotelRoomService: Omit<IService, "deleteById"> = {
    getData: async () => {
      try {
        const { data } = await app.$apiFetch<IHotelsData>(
          `hotel-room?populate=*`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getDataByFilter: async (obj: { [key: string]: ID | ID[] | string }) => {
      try {
        const { data } = await app.$apiFetch<IHotelsData>(
          `hotel-rooms?${requestFiltersCreator(obj)}&populate=*`
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
          `hotel-rooms?filters[users]=${userId}&populate=*`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    postData: async (hotel: IHotelCreate) => {
      try {
        const { data } = await app.$apiFetch<IHotelData>(`hotel-rooms`, {
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
        const { data } = await app.$apiFetch<IHotelData>(`hotel-rooms/${id}`, {
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
      hotelRoomService,
    },
  };
});
