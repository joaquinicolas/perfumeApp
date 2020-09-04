import {Connection, createQueryBuilder, getConnection, getManager, Repository} from 'typeorm';
import {Fragancia} from './entity/Fragancia';
import {Commodity} from './entity/Commodity';
import {FraganciaCommodity} from './entity/FraganciaCommodity';

interface FraganciaModelView {
  Description: string;
  Cost: number;
  Price: number;
  totalQuantity: number;
  Components: CommodityModelView[];
}

interface CommodityModelView {
  Description: string;
  Cost: number;
  CostByUnit: number;
  Quantity: number;
  JoinTableId: number;
}

export class API {
  // private static fraganciasRepository: Repository<Fragancia>;

  // Gets a list of all fragancias along with Components.
  public static async getFragancias(connection: Connection): Promise<FraganciaModelView[]> {
    let result: Promise<FraganciaModelView[]>;
    const fraganciasRepository = connection
      .getRepository(Fragancia);
    const fragancias = await fraganciasRepository
      .find({relations: ['Components']});
    result = Promise.all(
      fragancias.map(async fragancia => {
        let totalQuantity = 0;
        let costFragancia = 0.00;
        const components = await Promise.all(fragancia.Components.map(async (value) => {
          const commodity = await this.getCommodity(connection, value.Commodity_description);
          totalQuantity += value.Quantity;
          costFragancia += commodity.Cost * value.Quantity;
          return {
            Description: commodity.Description,
            CostByUnit: commodity.Cost, // How much costs a kilogram of commodity?
            Cost: commodity.Cost * value.Quantity, // How much spends we for x.x grams of commodity?
            Quantity: value.Quantity,
            JoinTableId: value.id
          };
        }));
        return {
          Description: fragancia.Description,
          Cost: costFragancia,
          Price: costFragancia * 2,
          totalQuantity,
          Components: components
        };
      })
    );
    return result;
  }

  // Gets components related to a fragancia.
  public static getCommodity(connection: Connection, commodityDescription: string): Promise<Commodity> {
    let result: Promise<Commodity>;
    const commoditiesRep = connection
      .getRepository(Commodity);

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

  public static getCommodities(connection: Connection): Promise<Commodity[]> {
    let result: Promise<Commodity[]>;
    const commoditiesRep = connection
      .getRepository(Commodity);

    result = commoditiesRep
      .find();

    return result;
  }

  public static async saveCommodity(commodity: Commodity): Promise<Commodity> {
    let result: Promise<Commodity>;
    const entityManager = getManager();
    const c = await entityManager.findOne(Commodity, commodity.Description);
    c.Cost = commodity.Cost;
    try {
      await entityManager.save(c);
      result = Promise.resolve(commodity);
    } catch (e) {
      console.log(e);
      result = Promise.reject(e);
    }

    return result;
  }

  public static async saveChanges(fragancia: FraganciaModelView): Promise<FraganciaModelView> {
    const entityManager = getManager();
    const f = await entityManager.findOne(Fragancia, fragancia.Description);
    if (!f) {
      return this.createFragancia(fragancia);
    }
    f.Description = fragancia.Description;
    let cost = 0.0;
    f.Components = await Promise.all(fragancia.Components.map(async component => {
      const fraganciaCommodity = await entityManager.findOne(FraganciaCommodity, component.JoinTableId);
      fraganciaCommodity.Fragancia_description = fragancia.Description;
      fraganciaCommodity.Quantity = component.Quantity;
      fraganciaCommodity.Commodity_description = component.Description;
      fraganciaCommodity.id = component.JoinTableId;
      await entityManager
        .save(fraganciaCommodity);


      cost += component.CostByUnit * fraganciaCommodity.Quantity;
      return fraganciaCommodity;
    }));

    f.Price = cost * 2;
    f.Cost = cost;
    try {
      await entityManager
        .save(f);
      fragancia.Cost = f.Cost;
      fragancia.Price = f.Price;
      return Promise.resolve(fragancia);
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  private static async createFragancia(fragancia: FraganciaModelView): Promise<FraganciaModelView> {
    const manager = getManager();
    const f = new Fragancia();
    f.Description = fragancia.Description;
    f.Price = fragancia.Price;
    f.Cost = fragancia.Cost;
    f.Components = await Promise.all(fragancia.Components.map(async value => {
      const fc = new FraganciaCommodity();
      fc.Quantity = value.Quantity;
      fc.Fragancia_description = fragancia.Description;
      fc.Commodity_description = value.Description;

      await manager
        .save(fc);

      return fc;
    }));

    await manager.save(f);
    return Promise.resolve(fragancia);
  }
}
