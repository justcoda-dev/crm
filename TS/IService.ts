import type { ID } from "./myTypes";

export interface IService {
  getData: () => Promise<any>;
  getDataById: (id: ID) => Promise<any>;
  postData: (data: any) => Promise<any>;
  updateDataById: (id: ID, data: any) => Promise<any>;
  deleteById: (id: ID) => Promise<any>;
  getDataByFilter: (ids: ID[] | ID, filterKey: string) => Promise<any>;
}
