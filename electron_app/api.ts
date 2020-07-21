import {Connection, createQueryBuilder, getConnection, getManager, Repository} from 'typeorm';
import {Fragancia} from './entity/Fragancia';
import {Commodity} from './entity/Commodity';
import {FraganciaCommodity} from './entity/FraganciaCommodity';

interface FraganciaModelView {
  id: number;
  Description: string;
  Cost: number;
  Price: number;
  Components: CommodityModelView[];
}

interface CommodityModelView {
  id: number;
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
        const components = await Promise.all(fragancia.Components.map(async (value) => {
          const commodity = await this.getCommodities(connection, value.Commodity_id);
          return {
            id: value.Commodity_id,
            Description: commodity.Description,
            CostByUnit: commodity.Cost, // How much costs a kilogram of commodity?
            Cost: commodity.Cost * value.Quantity, // How much spends we for x.x grams of commodity?
            Quantity: value.Quantity,
            JoinTableId: value.id
          };
        }));
        return {
          id: fragancia.id,
          Description: fragancia.Description,
          Cost: fragancia.Cost,
          Price: fragancia.Price,
          Components: components
        };
      })
    );
    return result;
  }

  // Gets components related to a fragancia.
  public static getCommodities(connection: Connection, commodityId: number): Promise<Commodity> {
    let result: Promise<Commodity>;
    const commoditiesRep = connection
      .getRepository(Commodity);

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

  public static async saveChanges(connection: Connection, fragancia: FraganciaModelView): Promise<FraganciaModelView> {
    const f = new Fragancia();
    f.id = fragancia.id;
    f.Description = fragancia.Description;
    f.Components = fragancia.Components.map(component => {
      const fraganciaCommodity = new FraganciaCommodity();
      fraganciaCommodity.Fragancia_id = fragancia.id;
      fraganciaCommodity.Quantity = component.Quantity;
      fraganciaCommodity.Commodity_id = component.id;
      fraganciaCommodity.id = component.JoinTableId;

      const commodity = new Commodity();
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
      await getConnection()
        .manager
        .save(f);
      fragancia.Cost = f.Cost;
      fragancia.Price = f.Price;
      return fragancia;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
