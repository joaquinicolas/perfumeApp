import { Fragancia } from './entity/Fragancia';
import { Commodity } from './entity/Commodity';
import { Store } from './main';
import { Observable } from 'rxjs';

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

  // Gets a list of sorted fragancias.
  public async getFragancias(): Promise<Fragancia[]> {
    return new Promise((resolve, reject) => {
      this.store.db.fragancias.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(
          docs.sort((a, b) => a.Description.localeCompare(b.Description))
        );
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
    return new Promise((resolve, reject) => {
      this.store.db.commodities.find({}, (err, docs) => {
        if (err) {
          reject(err);
          return;
        }

        const res = docs.sort((a, b) => {
          return a.Description.localeCompare(b.Description);
        });
        resolve(res);
      });
    });
  }

  public async saveCommodity(commodity: Commodity): Promise<Commodity> {
    return new Promise((resolve, reject) => {
      let query = { _id: commodity._id };
      this.store.db.commodities.update(
        query,
        {
          Description: commodity.Description,
          Cost: commodity.Cost,
          SecondaryName: commodity.SecondaryName,
        },
        { upsert: true },
        (err, numUpdated, upsert) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(commodity);
        }
      );
    });
  }

  updateCommodity(commodity: Commodity): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.db.commodities.update(
        { _id: commodity._id },
        commodity,
        { upsert: true },
        (err, numUpdated, upsert) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(commodity);
        }
      );
    });
  }

  updateFragancia(fragancia: Fragancia): Promise<any> {
    return new Promise((resolve, reject) => {
      fragancia.Components = fragancia.Components.map((v) => {
        return {
          _id: v._id,
          Commodity: null,
          Quantity: v.Quantity,
        };
      });
      if (fragancia._id == null) {
        return reject('Cannot find element with id = null');
      }
      // Price is being deleted because it's calculated at the runtime. We don't need to save this field.
      if (fragancia.Price != null) {
        delete fragancia.Price;
      }
      // same as price
      if (fragancia.Cost != null) {
        delete fragancia.Cost;
      }
      fragancia.Description = fragancia.Description.toUpperCase();
      this.store.db.fragancias.update(
        { _id: fragancia._id },
        fragancia,
        { upsert: false },
        (err, numUpdated, upsert) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(fragancia);
        }
      );
    });
  }

  public async saveFragancia(fragancia: Fragancia): Promise<any> {
    return new Promise((resolve, reject) => {
      const regex = new RegExp(`${fragancia.Description}`, 'gi');
      this.store.db.fragancias.find({ Description: regex }, (err, docs) => {
        if (!err && (!docs || docs.length == 0)) {
          fragancia.Components = fragancia.Components.map((v) => {
            return {
              _id: v._id,
              Commodity: null,
              Quantity: v.Quantity,
            };
          });
          if (fragancia._id == null) {
            delete fragancia._id;
          }
          // Price is being deleted because it's calculated at the runtime. We don't need to save this field.
          if (fragancia.Price != null) {
            delete fragancia.Price;
          }
          // same as price
          if (fragancia.Cost != null) {
            delete fragancia.Cost;
          }
          fragancia.Description = fragancia.Description.toUpperCase();
          this.store.db.fragancias.insert(fragancia, (err, doc) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(doc);
          });
        } else {
          if (err) return reject(err);
          else return reject(new Error('La fragancia ya existe'));
        }
      });
    });
  }
}
