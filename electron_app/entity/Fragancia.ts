import {PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, PrimaryColumn} from 'typeorm';
import {FraganciaCommodity} from './FraganciaCommodity';

@Entity({synchronize: false})
export class Fragancia {

  @PrimaryColumn('text', {name: 'Description'})
  Description: string;

  @Column('double')
  Cost: number;

  @Column('double')
  Price: number;

  @OneToMany(type => FraganciaCommodity, fraganciaToCommodity => fraganciaToCommodity.fragancia)
  public Components!: FraganciaCommodity[];
}
