import { BaseEntity } from "../shared/baseEntity.js"
import { Entity, Property } from "@mikro-orm/core"

@Entity()
export class Service extends BaseEntity {
  @Property()
  name!: string

  @Property()
  description!: string

  @Property({ unique: true })
  price!: string

  @Property({ hidden: true })
  duracion!: string

  @Property({ nullable: true })
  activo?: string

  @Property()
  createdAt: Date = new Date()
}
