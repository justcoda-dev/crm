import type {
  ICostumerData,
  ICostumerNewCreate,
  ICostumersData,
  ICostumerUpdate,
} from "~/TS/ICostumer";
import type { ID } from "~/TS/myTypes";
import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
export default defineNuxtPlugin((nuxtApp) => {
  const costumerService = () => {};
  const app = useNuxtApp();

  costumerService.postCostumer = async (
    newCostumerData: ICostumerNewCreate
  ) => {
    try {
      const { data } = await app.$apiFetch<ICostumerData>(
        "/costumers?populate=*",
        {
          method: "POST",
          body: {
            data: newCostumerData,
          },
        }
      );
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  costumerService.updateCostumerById = async (
    costumerData: ICostumerUpdate
  ) => {
    try {
      const { data } = await app.$apiFetch<ICostumerData>(
        `/costumers/${costumerData.id}?populate=*`,
        {
          method: "PUT",
          body: {
            data: costumerData,
          },
        }
      );
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  costumerService.getCostumerById = async (id: ID) => {
    try {
      const { data } = await app.$apiFetch<ICostumerData>(
        `/costumers/${id}?populate=*`
      );
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  costumerService.getCostumersByHotels = async (hotelIds: ID[]) => {
    try {
      const { data } = await app.$apiFetch<ICostumersData>(
        `/costumers?${requestFiltersCreator(hotelIds, "hotels")}`
      );
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  costumerService.deleteCostumer = async (id: ID) => {
    try {
      const costumerId = await app.$apiFetch<ID>(`/costumers/${id}`, {
        method: "DELETE",
      });
      return costumerId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    provide: {
      costumerService,
    },
  };
});
