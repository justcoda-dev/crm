import type { ICalendarDateFromDb } from "./ICalendarDate";
import type { IEnterpirse } from "./IEnterprice";
import type { ICostumer } from "./ICostumer";
import type { IUser } from "./IUser";
import type { ID } from "./myTypes";

export interface IHotel {
  id?: ID;
  name?: string;
  location?: string;
  max_clients?: number;
  user?: IUser[];
  costumers?: ICostumer[];
  enterprise?: IEnterpirse;
  calendar_dates?: ICalendarDateFromDb[];
}
export interface IHotelsData {
  data: IHotel[];
}
export interface IHotelData {
  data: IHotel;
}
export interface IHotelCreate {
  name: string;
  location: string;
  enterprise: IEnterpirse | ID;
  users: IUser[] | ID[];
}
