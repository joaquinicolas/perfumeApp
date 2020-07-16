"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fragancia_1 = require("./entity/Fragancia");
class API {
    // private static fraganciasRepository: Repository<Fragancia>;
    static getFragancias(connection) {
        let result;
        const fraganciasRepository = connection
            .getRepository(Fragancia_1.Fragancia);
        result = fraganciasRepository
            .find({ relations: ['Components'] });
        return result;
    }
}
exports.API = API;
//# sourceMappingURL=api.js.map