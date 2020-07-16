import {Connection, Repository} from 'typeorm';
import {Fragancia} from './entity/Fragancia';

export class API {
  // private static fraganciasRepository: Repository<Fragancia>;

  public static getFragancias(connection: Connection): Promise<Fragancia[]> {
    let result: Promise<Fragancia[]>;
    const fraganciasRepository = connection
      .getRepository(Fragancia);
    result = fraganciasRepository
      .find({relations: ['Components']});
    return result;
  }
}
