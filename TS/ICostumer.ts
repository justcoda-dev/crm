import type { ICalendarDates } from "./ICalendarDate";
import type { ID } from "./myTypes";

export interface ICostumer {
  id?: ID;
  attributes: {
    name: string;
    phone: string;
    calendar_dates: ICalendarDates;
  };
}
export interface ICostumerData {
  data: ICostumer;
}
export interface ICostumers {
  data: ICostumer[];
}
