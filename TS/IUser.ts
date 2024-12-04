import type { ICostumer } from "./ICostumer";
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
}

export interface IUserData {
  data: IUser[];
}