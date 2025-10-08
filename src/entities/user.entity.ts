import { BaseEntity } from "../shared/baseEntity.js"
import { Entity, Property } from "@mikro-orm/core"

@Entity()
export class User extends BaseEntity {
  @Property()
  firstName!: string

  @Property()
  lastName!: string

  @Property()
  userType!: "Admin" | "Client" | "Employee"

  @Property({ unique: true })
  email!: string

  @Property({ hidden: true })
  password!: string

  @Property({ nullable: true })
  phoneNumber?: string

  @Property()
  createdAt: Date = new Date()
}
