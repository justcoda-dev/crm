import type { ID } from "./myTypes";

export interface ICurrentPrice {
  id: ID;
  key: string;
  type: string;
  value: string;
}
export interface IcurrentPrices {
  data: ICurrentPrice[];
}
