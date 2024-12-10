import type { ICalendarDateFromDb } from "./ICalendarDate";
import type { IEnterpirce } from "./IEnterprice";
import type { ICostumer } from "./ICostumer";
import type { IUser } from "./IUser";
import type { ID } from "./myTypes";

export interface IHotel {
  id: ID;

  name: string;
  location?: string;
  max_clients?: number;
  user: IUser[];
  costumers: ICostumer[];
  enterprice: IEnterpirce;
  calendar_dates: ICalendarDateFromDb[];
}
export interface IHotelsData {
  data: IHotel[];
}
