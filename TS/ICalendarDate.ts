import type { ICostumer } from "./ICostumer";
import type { IHotel } from "./IHotel";
import type { IUser } from "./IUser";
import type { ID } from "./myTypes";

export interface ICalendarDateFromDb {
  id: ID;
  filter_date: string;
  total_price: string;
  start: string;
  end: string;
  costumer: ICostumer;
  user: IUser;
  hotel: IHotel;
}
export interface ICalendarDateDataFromDb {
  data: ICalendarDateFromDb;
}
export interface ICalendarDates {
  data: ICalendarDateFromDb[];
}

export interface ICalendarDateCreate {
  selected: boolean;
  reserved: boolean;
  start_date: boolean;
  end_date: boolean;
  disabled: boolean;
  costumer_enter: ICostumer | {};
  costumer_leave: ICostumer | {};
  day: number;
  year: number;
  month: number;
  filter_date: number;
  id: ID;
  full_date: string;
  day_number: number;
}
export interface ICalendarCreateSelectedDates {
  start: ICalendarDateCreate;
  end: ICalendarDateCreate;
  total_price: number;
  days_count: number;
}
