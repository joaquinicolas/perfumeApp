import { Commodity } from './Commodity';

export class Fragancia {

  _id: any;

  Description: string;

  Cost: number;

  Price: number;

  public Components!: Fragancia_Commodity[];
}

export interface Fragancia_Commodity {
  _id: any;
  Commodity: Commodity;
  Quantity: number;
}
