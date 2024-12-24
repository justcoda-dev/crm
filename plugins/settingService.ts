import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type { IService } from "~/TS/IService";
import type { ISetting, ISettingData, ISettingsData } from "~/TS/ISetting";
import type { ID } from "~/TS/myTypes";

export default defineNuxtPlugin((nuxtApp) => {
  const app = useNuxtApp();
  const settingService: IService = {
    updateDataById: async (settingsData: ISettingsData, id: ID) => {
      try {
        const { data } = await app.$apiFetch<ISettingData>(`settings/${id}`, {
          method: "PUT",
          body: { data: settingsData },
        });

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    getDataByFilter: async (obj: { [key: string]: ID | ID[] | string }) => {
      try {
        const { data } = await app.$apiFetch<ISettingsData>(
          `settings?${requestFiltersCreator(obj)}&populate=*`
        );
        return data[0].component;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getData: async () => {
      try {
        const { data } = await app.$apiFetch<ISettingsData>(
          "settings?populate=*"
        );
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };

  return {
    provide: {
      settingService,
    },
  };
});
