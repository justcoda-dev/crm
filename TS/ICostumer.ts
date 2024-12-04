import type { ICalendarDate } from "./ICalendarDate";
import type { IHotel } from "./IHotel";
import type { IUser } from "./IUser";
import type { ID } from "./myTypes";

export interface ICostumer {
  id: ID;
  name: string;
  phone: string;
  calendar_dates?: ICalendarDate[];
  address?: string;
  email?: string;
  user: IUser;
  hotels?: IHotel[];
}

export interface ICostumerData {
  data: ICostumer;
}

export interface ICostumersData {
  data: ICostumer[];
}
