import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TypeSavingsWithdrawal } from '../dto/create-savings-withdrawal.dto';
import { UsersClient } from 'src/modules/users-clients/entities/users-client.entity';
import { User } from 'src/modules/users/entities/user.entity';

enum PaymentMethod{
  CASH='Cash',
  TRANSFER='Transfer',
  DEPOSIT='Deposit',
  CHECK='Check'
}

@Entity()
export class SavingsWithdrawal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numberAccount!: string;

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00})
  amount!: number;

  @Column({ type: 'enum', enum: TypeSavingsWithdrawal, nullable: true })
  type!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH, nullable: true })
  paidMethod!: string;

  @Column({ type: 'date', nullable: true })
  date!: Date;

  @Column('bigint')
  userClientId!: number;

  @Column('bigint')
  userId!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => UsersClient, (userClient) => userClient.id, {onDelete:'CASCADE'})
  @JoinColumn({name: 'userClientId'})
  userClient!: UsersClient;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
