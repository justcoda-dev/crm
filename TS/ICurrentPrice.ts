import type { ID } from "./myTypes";

export interface ICurrentPrice {
  id: ID;
  attributes: {
    key: string;
    type: string;
    value: string;
  };
}
export interface IcurrentPrices {
  data: ICurrentPrice[];
}
