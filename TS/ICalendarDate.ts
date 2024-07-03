import type { ICostumer } from "./ICostumer";

export interface ICalendarDate {
  id: ID;
  attributes: {
    filter_date: string;
    total_price: string;
    start: string;
    end: string;
    costumer: {
      data: ICostumer;
    };
  };
}
export interface ICalendarDateData {
    data: ICalendarDate;
  }
export interface ICalendarDates {
  data: ICalendarDate[];
}
