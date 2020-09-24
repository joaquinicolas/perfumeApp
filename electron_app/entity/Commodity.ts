import {PrimaryColumn, Column, OneToMany, Entity,} from 'typeorm';
import {FraganciaCommodity} from './FraganciaCommodity';

@Entity({synchronize: false, name: 'Commodities'})
export class Commodity {

  @PrimaryColumn('text', {name: 'Description'})
  public Description: string;

  @Column()
  public Cost: number;

  @Column()
  public Name: string;

  @OneToMany(type => FraganciaCommodity, commodityToFragancias => commodityToFragancias.commodity)
  public commodityFragancias!: FraganciaCommodity[];
}
