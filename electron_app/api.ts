import { Fragancia, Fragancia_Commodity } from './entity/Fragancia';
import { Commodity } from './entity/Commodity';
import * as Datastore from 'nedb';
import { Store } from './main';
import { Observable } from 'rxjs';

interface FraganciaModelView {
  Description: string;
  Cost: number;
  Price: number;
  totalQuantity: number;
  Components: CommodityModelView[];
}

// TODO: remove after refactoring
interface CommodityModelView {
  Description: string;
  Cost: number;
  CostByUnit: number;
  Quantity: number;
  JoinTableId: number;
}

export class API {
  store: Store;
  static instance: any;

  constructor(store: Store) {
    if (typeof API.instance === 'object') {
      return API.instance;
    }
    this.store = store;
    API.instance = this;
    return this;
  }
  // private static fraganciasRepository: Repository<Fragancia>;

  // Gets a list of all fragancias.
  public async getFragancias() {
    return new Promise((resolve, reject) => {
      this.store.db.fragancias.find({}, (err, docs) => {
        if (err) reject(err);

        resolve(docs);
      });
    });
  }

  CommodityById(id: any): Observable<Commodity> {
    return new Observable((observer) => {
      this.store.db.commodities.findOne({ _id: id }, (err, doc) => {
        if (err) return observer.error(err);
        observer.next(doc);
        observer.complete();
      });
    });
  }

  public getCommodities(): Promise<Commodity[]> {
    let result: Promise<Commodity[]>;

    this.store.db.commodities.find({}, (err, docs) => {
      if (err) {
        result = Promise.reject(err);
        return;
      }

      result = Promise.resolve(docs);
    });

    return result;
  }

  public async saveCommodity(commodity: Commodity): Promise<Commodity> {
    let result: Promise<Commodity>;
    this.store.db.commodities.insert(commodity, (err, doc) => {
      if (err) {
        result = Promise.reject(err);
        return;
      }
      result = Promise.resolve(doc);
    });
    return result;
  }

  public async saveFragancia(fragancia: Fragancia): Promise<any> {
    let result: Promise<any>;
    fragancia.Components = fragancia.Components.map((v) => {
      v.Commodity = null;
      return v;
    });
    this.store.db.fragancias.insert(fragancia, (err, newDoc) => {
      if (err) {
        result = Promise.reject(err);
        return;
      }
      result = Promise.resolve(newDoc);
    });

    return result;
  }
}
