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
        let result;
        this.store.db.commodities.find({}, (err, docs) => {
            if (err) {
                result = Promise.reject(err);
                return;
            }
            result = Promise.resolve(docs);
        });
        return result;
    }
    saveCommodity(commodity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
            this.store.db.commodities.insert(commodity, (err, doc) => {
                if (err) {
                    result = Promise.reject(err);
                    return;
                }
                result = Promise.resolve(doc);
            });
            return result;
        });
    }
    saveFragancia(fragancia) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
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
        });
    }
}
exports.API = API;
//# sourceMappingURL=api.js.map