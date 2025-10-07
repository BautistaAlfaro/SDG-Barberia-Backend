
import { BaseEntity } from '../shared/baseEntity.js'
import {Entity, Property, OneToMany, Cascade, Collection} from '@mikro-orm/core'
// import {Reservation} from '../Reservation/reservation.entity.js'

@Entity()
export class User extends BaseEntity{
        @Property()
        firstName!: string

        @Property()
        lastName!: string

        @Property()
        userType!: 'Admin' | 'Client' | 'Employee';

        @Property({ nullable: true })
        email!: string;

        @Property({ nullable: true })
        password!: string;

        @Property({ nullable: true })
        phoneNumber!: string;

        @Property({ nullable: true })
        createdAt: Date = new Date();

               // @OneToMany(() => Reservation, (reservation: Reservation) => reservation.user, {
       //         cascade: [Cascade.ALL],
       // })
        // reservations = new Collection<Reservation>(this);

}
