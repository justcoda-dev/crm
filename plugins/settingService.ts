import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type { ISetting, ISettingData, ISettingsData } from "~/TS/ISetting";
import type { ID } from "~/TS/myTypes";

export default defineNuxtPlugin((nuxtApp) => {
  const settingService = () => {};
  const app = useNuxtApp();

  settingService.updateSettings = async (data: ISettingsData, id: ID) => {
    try {
      return await app.$apiFetch<ISetting>(`settings/${id}`, {
        method: "PUT",
        body: data,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  settingService.updateSetting = async (setting: ISetting) => {
    try {
      return await app.$apiFetch<ISetting>(`settings/${setting.id}`, {
        method: "PUT",
        body: setting,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  settingService.getSettingByKey = async (key: string) => {
    try {
      const { data } = await app.$apiFetch<ISettingsData>(
        `settings?${requestFiltersCreator(key, "key")}&populate=*`
      );
      return data[0].component;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  settingService.getSettings = async () => {
    try {
      return await app.$useApiFetch<ISettingsData>(() => "settings?populate=*");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    provide: {
      settingService,
    },
  };
});
