import {Entity, Column, ManyToOne, PrimaryColumn} from 'typeorm';
import {Fragancia} from './Fragancia';
import {Commodity} from './Commodity';

@Entity({synchronize: false, name: 'FraganciaCommodities'})
export class FraganciaCommodity {

  @PrimaryColumn()
  public id!: number;

  @Column('integer', {name: 'fraganciaId'})
  public Fragancia_id!: number;

  @Column('integer', {name: 'commodityId'})
  public Commodity_id!: number;

  @Column()
  public Quantity: number;

  @ManyToOne(type => Fragancia, fragancia => fragancia.Components)
  public fragancia!: Fragancia;

  @ManyToOne(type => Commodity, commodity => commodity.commodityFragancias)
  public commodity!: Commodity;
}
