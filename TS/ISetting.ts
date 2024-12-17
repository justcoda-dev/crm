import type { ID } from "./myTypes";

export interface ISetting {
  id: ID;
  title: string;
  key: string;
  component: any[];
}
export interface ISettingData {
  data: ISetting;
}

export interface ISettingsData {
  data: ISetting[];
}
