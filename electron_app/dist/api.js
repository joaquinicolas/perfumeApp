"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Fragancia_1 = require("./entity/Fragancia");
const Commodity_1 = require("./entity/Commodity");
const FraganciaCommodity_1 = require("./entity/FraganciaCommodity");
class API {
    // private static fraganciasRepository: Repository<Fragancia>;
    // Gets a list of all fragancias along with Components.
    static getFragancias(connection) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
            const fraganciasRepository = connection
                .getRepository(Fragancia_1.Fragancia);
            const fragancias = yield fraganciasRepository
                .find({ relations: ['Components'] });
            result = Promise.all(fragancias.map((fragancia) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let totalQuantity = 0;
                let costFragancia = 0.00;
                const components = yield Promise.all(fragancia.Components.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const commodity = yield this.getCommodity(connection, value.Commodity_description);
                    totalQuantity += value.Quantity;
                    costFragancia += commodity.Cost * value.Quantity;
                    return {
                        Description: commodity.Description,
                        CostByUnit: commodity.Cost,
                        Cost: commodity.Cost * value.Quantity,
                        Quantity: value.Quantity,
                        JoinTableId: value.id
                    };
                })));
                return {
                    Description: fragancia.Description,
                    Cost: costFragancia,
                    Price: costFragancia * 2,
                    totalQuantity,
                    Components: components
                };
            })));
            return result;
        });
    }
    // Gets components related to a fragancia.
    static getCommodity(connection, commodityDescription) {
        let result;
        const commoditiesRep = connection
            .getRepository(Commodity_1.Commodity);
        result = commoditiesRep
            .createQueryBuilder()
            .where(`Description LIKE '${commodityDescription}%'`)
            .select(['Description AS Description', 'Cost AS Cost'])
            .getRawOne()
            .then((rawCommodity) => {
            if (rawCommodity) {
                return rawCommodity;
            }
            return {};
        });
        return result;
    }
    static getCommodities(connection) {
        let result;
        const commoditiesRep = connection
            .getRepository(Commodity_1.Commodity);
        result = commoditiesRep
            .find();
        return result;
    }
    static saveCommodity(commodity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
            const entityManager = typeorm_1.getManager();
            const c = yield entityManager.findOne(Commodity_1.Commodity, commodity.Description);
            c.Cost = commodity.Cost;
            try {
                yield entityManager.save(c);
                result = Promise.resolve(commodity);
            }
            catch (e) {
                console.log(e);
                result = Promise.reject(e);
            }
            return result;
        });
    }
    static saveChanges(fragancia) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const entityManager = typeorm_1.getManager();
            const f = yield entityManager.findOne(Fragancia_1.Fragancia, fragancia.Description);
            if (!f) {
                return this.createFragancia(fragancia);
            }
            f.Description = fragancia.Description;
            let cost = 0.0;
            f.Components = yield Promise.all(fragancia.Components.map((component) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const fraganciaCommodity = yield entityManager.findOne(FraganciaCommodity_1.FraganciaCommodity, component.JoinTableId);
                fraganciaCommodity.Fragancia_description = fragancia.Description;
                fraganciaCommodity.Quantity = component.Quantity;
                fraganciaCommodity.Commodity_description = component.Description;
                fraganciaCommodity.id = component.JoinTableId;
                yield entityManager
                    .save(fraganciaCommodity);
                cost += component.CostByUnit * fraganciaCommodity.Quantity;
                return fraganciaCommodity;
            })));
            f.Price = cost * 2;
            f.Cost = cost;
            try {
                yield entityManager
                    .save(f);
                fragancia.Cost = f.Cost;
                fragancia.Price = f.Price;
                return Promise.resolve(fragancia);
            }
            catch (e) {
                console.log(e);
                return Promise.reject(e);
            }
        });
    }
    static createFragancia(fragancia) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const manager = typeorm_1.getManager();
            const f = new Fragancia_1.Fragancia();
            f.Description = fragancia.Description;
            f.Price = fragancia.Price;
            f.Cost = fragancia.Cost;
            f.Components = yield Promise.all(fragancia.Components.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const fc = new FraganciaCommodity_1.FraganciaCommodity();
                fc.Quantity = value.Quantity;
                fc.Fragancia_description = fragancia.Description;
                fc.Commodity_description = value.Description;
                yield manager
                    .save(fc);
                return fc;
            })));
            yield manager.save(f);
            return Promise.resolve(fragancia);
        });
    }
}
exports.API = API;
//# sourceMappingURL=api.js.map