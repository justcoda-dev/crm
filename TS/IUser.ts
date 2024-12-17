import type { ICostumer } from "./ICostumer";
import type { IEnterpirse } from "./IEnterprice";
import type { IHotel } from "./IHotel";
import type { ID } from "./myTypes";

export interface IUser {
  id: ID;
  name: string;
  surname: string;
  email: string;
  username: string;
  bloked?: string;
  confirmed?: string;
  role?: string;
  costumers: ICostumer[];
  hotels?: IHotel[];
  enterprise: IEnterpirse;
}

export interface IUserData {
  data: IUser[];
}
