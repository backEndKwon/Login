import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { UUID } from './types/user.type';
import { ProductsEntity } from 'src/product/product.entity';
  // import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('Users')
  export class UsersEntity extends BaseEntity {
    /* 
  
  */
  
    @PrimaryGeneratedColumn()
    userId: UUID;
  
    @Column()
    email: string;
  
    @Column()
    password: string;
  
    @Column()
    createProd: string[];
  
    @Column()
    reservationList: string[];
    
    @CreateDateColumn()
    createdAt: Date;
    
    @CreateDateColumn()
    updatedAt: Date;
    
    @OneToMany(() => ProductsEntity, (product) => product.userId) // 여러 상품은 하나의 사용자에 속함
    product: ProductsEntity;
  }
  