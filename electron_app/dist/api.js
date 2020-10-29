"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
class API {
    constructor(store) {
        if (typeof API.instance === 'object') {
            return API.instance;
        }
        this.store = store;
        API.instance = this;
        return this;
    }
    // private static fraganciasRepository: Repository<Fragancia>;
    // Gets a list of all fragancias.
    getFragancias() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.store.db.fragancias.find({}, (err, docs) => {
                    if (err)
                        reject(err);
                    resolve(docs);
                });
            });
        });
    }
    CommodityById(id) {
        return new rxjs_1.Observable((observer) => {
            this.store.db.commodities.findOne({ _id: id }, (err, doc) => {
                if (err)
                    return observer.error(err);
                observer.next(doc);
                observer.complete();
            });
        });
    }
    getCommodities() {
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
    saveCommodity(commodity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.store.db.commodities.update({ _id: commodity._id }, commodity, { upsert: true }, (err, numUpdated, upsert) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(commodity);
                });
            });
        });
    }
    saveFragancia(fragancia) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                this.store.db.fragancias.update({ _id: fragancia._id }, fragancia, { upsert: true }, (err, numUpdated, upsert) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(fragancia);
                });
            });
        });
    }
}
exports.API = API;
//# sourceMappingURL=api.js.map