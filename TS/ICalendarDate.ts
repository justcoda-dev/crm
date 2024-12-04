import type { ICostumer } from "./ICostumer";
import type { ID } from "./myTypes";

export interface ICalendarDate {
  id: ID;
  filter_date: string;
  total_price: string;
  start: string;
  end: string;
  costumer: ICostumer;
}
export interface ICalendarDateData {
  data: ICalendarDate;
}
export interface ICalendarDates {
  data: ICalendarDate[];
}
