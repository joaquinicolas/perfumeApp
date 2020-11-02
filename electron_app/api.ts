import {Fragancia, Fragancia_Commodity} from './entity/Fragancia';
import {Commodity} from './entity/Commodity';
import * as Datastore from 'nedb';
import {Store} from './main';
import {Observable} from 'rxjs';


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
      this.store.db.commodities.findOne({_id: id}, (err, doc) => {
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

        resolve(docs);
      });
    });
  }

  public async saveCommodity(commodity: Commodity): Promise<Commodity> {
    return new Promise((resolve, reject) => {
      const regex = new RegExp(`${commodity.Description}`, 'gi');
      this.store.db.commodities.find({"Description": regex}, (err, docs) => {
        if (!err && (!docs || docs.length == 0)) {
          this.store.db.commodities.update(
            {_id: commodity._id},
            commodity,
            {upsert: true},
            (err, numUpdated, upsert) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(commodity);
            });
        }
        else {
          if (err)
            return reject(err)
          else
            return reject(new Error('Materia prima ya existe'))
        }
      });
    });

  }

  updateCommodity(commodity: Commodity): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.db.commodities.update(
        {_id: commodity._id},
        commodity,
        {upsert: true},
        (err, numUpdated, upsert) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(commodity);
        });
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
        delete fragancia._id;
      }
      if (fragancia.Price != null) {
        delete fragancia.Price;
      }
      if (fragancia.Cost != null) {
        delete fragancia.Cost;
      }
      this.store.db.fragancias.update(
        {_id: fragancia._id},
        fragancia,
        {upsert: false},
        (err, numUpdated, upsert) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(fragancia);
        });
    });
  }

  // TODO: use insert instead of upsert.
  public async saveFragancia(fragancia: Fragancia): Promise<any> {
    return new Promise((resolve, reject) => {
      const regex = new RegExp(`${fragancia.Description}`, 'gi');
      this.store.db.fragancias.find({"Description": regex}, (err, docs) => {
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
          if (fragancia.Price != null) {
            delete fragancia.Price;
          }
          if (fragancia.Cost != null) {
            delete fragancia.Cost;
          }
          this.store.db.fragancias.update(
            {_id: fragancia._id},
            fragancia,
            {upsert: true},
            (err, numUpdated, upsert) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(fragancia);
            });
        } else {
          if (err)
            return reject(err)
          else
            return reject(new Error('La fragancia ya existe'))
        }
      })
    });
  }
}
