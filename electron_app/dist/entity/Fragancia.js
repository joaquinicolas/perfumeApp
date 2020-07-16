"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const FraganciaCommodity_1 = require("./FraganciaCommodity");
let Fragancia = class Fragancia {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], Fragancia.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Fragancia.prototype, "Description", void 0);
tslib_1.__decorate([
    typeorm_1.Column('double'),
    tslib_1.__metadata("design:type", Number)
], Fragancia.prototype, "Cost", void 0);
tslib_1.__decorate([
    typeorm_1.Column('double'),
    tslib_1.__metadata("design:type", Number)
], Fragancia.prototype, "Price", void 0);
tslib_1.__decorate([
    typeorm_1.OneToMany(type => FraganciaCommodity_1.FraganciaCommodity, fraganciaToCommodity => fraganciaToCommodity.fragancia),
    tslib_1.__metadata("design:type", Array)
], Fragancia.prototype, "Components", void 0);
Fragancia = tslib_1.__decorate([
    typeorm_1.Entity({ synchronize: false })
], Fragancia);
exports.Fragancia = Fragancia;
//# sourceMappingURL=Fragancia.js.map