import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true
  })
  name: string

  @Column({
    type: 'real',
    nullable: true
  })
  price: number

  @Column({
    nullable: true
  })
  left: number
}
