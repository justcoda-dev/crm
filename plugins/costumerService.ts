import type {
  ICostumerData,
  ICostumerNewCreate,
  ICostumersData,
  ICostumerUpdate,
} from "~/TS/ICostumer";
import type { IService } from "~/TS/IService";
import type { ID } from "~/TS/myTypes";
import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
export default defineNuxtPlugin((nuxtApp) => {
  const app = useNuxtApp();

  const costumerService: Omit<IService, "getData"> = {
    postData: async (newCostumerData: ICostumerNewCreate) => {
      try {
        if (newCostumerData.costumer_from_db) {
          return await app.$costumerService.getDataById(newCostumerData.id);
        } else {
          const { id, ...newCostumer } = newCostumerData;
          const { data } = await app.$apiFetch<ICostumerData>(
            "/costumers?populate=*",
            {
              method: "POST",
              body: {
                data: newCostumer,
              },
            }
          );
          return data;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    updateDataById: async (id: ID, costumerData: ICostumerUpdate) => {
      try {
        const { data } = await app.$apiFetch<ICostumerData>(
          `/costumers/${id}?populate=*`,
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
    },

    getDataById: async (id: ID) => {
      try {
        const { data } = await app.$apiFetch<ICostumerData>(
          `/costumers/${id}?populate=*`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getDataByFilter: async (ids: ID[] | ID, filterKey: string) => {
      try {
        const { data } = await app.$apiFetch<ICostumersData>(
          `/costumers?${requestFiltersCreator(ids, filterKey)}`
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    deleteById: async (id: ID) => {
      try {
        const costumerId = await app.$apiFetch<ID>(`/costumers/${id}`, {
          method: "DELETE",
        });
        return costumerId;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };

  return {
    provide: {
      costumerService,
    },
  };
});
