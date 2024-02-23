import { UUID } from 'src/auth/types/user.type';
import { UsersEntity } from './user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { ApiProperty } from '@nestjs/swagger';

@Entity('Products')
export class ProductsEntity extends BaseEntity {
  /* 
상품은
상품정보와 해당 상품을 올린 사람에 대한 정보를 가지고 있음.
상품 생성시 itemId가 생성

상품정보 = itemId, userId, prodTitle(보통prod라고 줄여씀), prodPrice, prodQuantity, limitQuantity(default 5개), reservationList, createdAt, UpdatedAt,

*/

  @PrimaryGeneratedColumn()
  itemId: number;

  @Column('uuid')
  userId: string;

  @Column({nullable:false})
  prodTitle: string;

  @Column({nullable:false})
  prodPrice: number;
  
  @Column({nullable:false})
  prodQuantity: number;
  
  @Column({nullable:true, type: 'jsonb', array: true})
  reservationList: string[];
  
  @CreateDateColumn()
  createdAt: Date;
  
  @CreateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => UsersEntity, (user) => user.userId) // 여러 상품은 하나의 사용자에 속함
  user: UsersEntity;
}
