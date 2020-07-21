import { PrimaryColumn, Column, OneToMany, Entity,  } from 'typeorm';
import { FraganciaCommodity } from './FraganciaCommodity';

@Entity({ synchronize: false, name: 'Commodities' })
export class Commodity {

    @PrimaryColumn()
    public id: number;

    @Column()
    public Description: string;

    @Column()
    public Cost: number;

    @OneToMany(type => FraganciaCommodity, commodityToFragancias => commodityToFragancias.commodity)
    public commodityFragancias!: FraganciaCommodity[];
}
