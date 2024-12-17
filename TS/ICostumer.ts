import type { ICalendarDateFromDb } from "./ICalendarDate";
import type { IHotel } from "./IHotel";
import type { IUser } from "./IUser";
import type { ID } from "./myTypes";

export interface ICostumer {
  id: ID;
  name: string;
  phone: string;
  calendar_dates: ICalendarDateFromDb[];
  address?: string;
  email?: string;
  user: IUser;
  hotels: IHotel[];
  costumers_count?: number;
}

export interface ICostumerData {
  data: ICostumer;
}

export interface ICostumersData {
  data: ICostumer[];
}
export interface ICostumerCreate {
  name: string;
  phone: string;
  costumer_from_db: boolean;
  user: ID;
  hotels: ID;
  id: ID;
  costumers_count?: number;
}
export interface ICostumerUpdate {
  id: ID;
  name?: string;
  phone?: string;
  user?: ID | IUser | null;
  hotels?: any;
  calendar_dates?: any;
  costumers_count?: number;
}
export interface ICostumerNewCreate {
  id: ID;
  name: string;
  phone: string;
  costumer_from_db: boolean;
  user: ID;
  hotels: ID;
  costumers_count?: number;
}
