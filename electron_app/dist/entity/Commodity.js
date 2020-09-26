"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const FraganciaCommodity_1 = require("./FraganciaCommodity");
let Commodity = class Commodity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryColumn('text', { name: 'Description' }),
    tslib_1.__metadata("design:type", String)
], Commodity.prototype, "Description", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Commodity.prototype, "Cost", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Commodity.prototype, "Name", void 0);
tslib_1.__decorate([
    typeorm_1.OneToMany(type => FraganciaCommodity_1.FraganciaCommodity, commodityToFragancias => commodityToFragancias.commodity),
    tslib_1.__metadata("design:type", Array)
], Commodity.prototype, "commodityFragancias", void 0);
Commodity = tslib_1.__decorate([
    typeorm_1.Entity({ synchronize: false, name: 'Commodities' })
], Commodity);
exports.Commodity = Commodity;
//# sourceMappingURL=Commodity.js.map