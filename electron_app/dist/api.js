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
                const components = yield Promise.all(fragancia.Components.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const commodity = yield this.getCommodities(connection, value.Commodity_id);
                    return {
                        id: value.Commodity_id,
                        Description: commodity.Description,
                        CostByUnit: commodity.Cost,
                        Cost: commodity.Cost * value.Quantity,
                        Quantity: value.Quantity,
                        JoinTableId: value.id
                    };
                })));
                return {
                    id: fragancia.id,
                    Description: fragancia.Description,
                    Cost: fragancia.Cost,
                    Price: fragancia.Price,
                    Components: components
                };
            })));
            return result;
        });
    }
    // Gets components related to a fragancia.
    static getCommodities(connection, commodityId) {
        let result;
        const commoditiesRep = connection
            .getRepository(Commodity_1.Commodity);
        result = commoditiesRep
            .createQueryBuilder()
            .where(`id = ${commodityId}`)
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
    static saveChanges(connection, fragancia) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const f = new Fragancia_1.Fragancia();
            f.id = fragancia.id;
            f.Description = fragancia.Description;
            f.Components = fragancia.Components.map(component => {
                const fraganciaCommodity = new FraganciaCommodity_1.FraganciaCommodity();
                fraganciaCommodity.Fragancia_id = fragancia.id;
                fraganciaCommodity.Quantity = component.Quantity;
                fraganciaCommodity.Commodity_id = component.id;
                fraganciaCommodity.id = component.JoinTableId;
                const commodity = new Commodity_1.Commodity();
                commodity.id = component.id;
                commodity.Cost = component.CostByUnit;
                commodity.Description = component.Description;
                fraganciaCommodity.commodity = commodity;
                return fraganciaCommodity;
            });
            let cost = 0.0;
            fragancia.Components
                .forEach(component => cost += component.CostByUnit * component.Quantity);
            f.Price = cost * 2;
            f.Cost = cost;
            try {
                yield typeorm_1.getConnection()
                    .manager
                    .save(f);
                fragancia.Cost = f.Cost;
                fragancia.Price = f.Price;
                return fragancia;
            }
            catch (e) {
                console.log(e);
                return e;
            }
        });
    }
}
exports.API = API;
//# sourceMappingURL=api.js.map