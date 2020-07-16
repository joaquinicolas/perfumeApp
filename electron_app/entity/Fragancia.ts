import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany } from "typeorm";
import { FraganciaCommodity } from './FraganciaCommodity';

@Entity({synchronize: false})
export class Fragancia {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Description: string;

    @Column('double')
    Cost: number;

    @Column('double')
    Price: number;

    @OneToMany(type => FraganciaCommodity, fraganciaToCommodity => fraganciaToCommodity.fragancia)
    public Components!: FraganciaCommodity[];
}
