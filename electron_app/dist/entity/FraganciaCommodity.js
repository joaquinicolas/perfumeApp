"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const Fragancia_1 = require("./Fragancia");
const Commodity_1 = require("./Commodity");
let FraganciaCommodity = class FraganciaCommodity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], FraganciaCommodity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text', { name: 'fraganciaDescription' }),
    tslib_1.__metadata("design:type", String)
], FraganciaCommodity.prototype, "Fragancia_description", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text', { name: 'commodityDescription' }),
    tslib_1.__metadata("design:type", String)
], FraganciaCommodity.prototype, "Commodity_description", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], FraganciaCommodity.prototype, "Quantity", void 0);
tslib_1.__decorate([
    typeorm_1.ManyToOne(type => Fragancia_1.Fragancia, fragancia => fragancia.Components),
    tslib_1.__metadata("design:type", Fragancia_1.Fragancia)
], FraganciaCommodity.prototype, "fragancia", void 0);
tslib_1.__decorate([
    typeorm_1.ManyToOne(type => Commodity_1.Commodity, commodity => commodity.commodityFragancias),
    tslib_1.__metadata("design:type", Commodity_1.Commodity)
], FraganciaCommodity.prototype, "commodity", void 0);
FraganciaCommodity = tslib_1.__decorate([
    typeorm_1.Entity({ synchronize: false, name: 'FraganciaCommodities' })
], FraganciaCommodity);
exports.FraganciaCommodity = FraganciaCommodity;
//# sourceMappingURL=FraganciaCommodity.js.map