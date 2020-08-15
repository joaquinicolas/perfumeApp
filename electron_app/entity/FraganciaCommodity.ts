import {Entity, Column, ManyToOne, PrimaryColumn} from 'typeorm';
import {Fragancia} from './Fragancia';
import {Commodity} from './Commodity';

@Entity({synchronize: false, name: 'FraganciaCommodities'})
export class FraganciaCommodity {

  @PrimaryColumn()
  public id!: number;

  @Column('text', {name: 'fraganciaDescription'})
  public Fragancia_description!: string;

  @Column('text', {name: 'commodityDescription'})
  public Commodity_description!: string;

  @Column()
  public Quantity: number;

  @ManyToOne(type => Fragancia, fragancia => fragancia.Components)
  public fragancia!: Fragancia;

  @ManyToOne(type => Commodity, commodity => commodity.commodityFragancias)
  public commodity!: Commodity;
}
