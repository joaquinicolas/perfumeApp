import { Commodity } from './Commodity';

// Not Stored fields are calculated from commodities quantity and cost.
export class Fragancia {

  _id: any;

  Description: string;

  // Not stored.
  Cost: number;

  // Not stored.
  Price: number;

  public Components!: Fragancia_Commodity[];
}

export interface Fragancia_Commodity {
  _id: any;
  Commodity: Commodity;
  Quantity: number;
}
