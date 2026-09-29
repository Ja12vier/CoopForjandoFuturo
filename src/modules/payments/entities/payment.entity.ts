import { StateLoan } from 'src/modules/loans/dto/create-loan.dto';
import { PaymentMethod } from 'src/modules/savings-withdrawals/dto/create-savings-withdrawal.dto';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { SourcePayment } from '../dto/create-payment.dto';
import { UsersClient } from 'src/modules/users-clients/entities/users-client.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { LoanQuota } from 'src/modules/loan-quotas/entities/loan-quota.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', {precision:10, scale:2,nullable:true, default:0.00})
  amountPaid!: number;
  
  @Column('decimal',{precision:10, scale:2,nullable:true, default:0.00})
  appliedAmount!:number; // El monto aplicado
  
  @Column('decimal',{precision:10, scale:2,nullable:true, default:0.00})
  excessAmount!:number; //El monto que sobro

  @Column({ type: 'date' })
  datePayment!: Date;

  @Column({type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH, nullable: true })
  methodPayment!: string;

  @Column({type: 'enum', enum: SourcePayment, default:SourcePayment.Normal_Payment })
  source!: string;

  @Column({type: 'enum', enum: StateLoan, default:StateLoan.PAID, nullable: true })
  status!: string;

  @Column('bigint')
  loanQuotaId!: number;

  @Column('bigint')
  userClienteId!: number;

  @Column('bigint')
  userId!: number;

  @Column({ nullable: true })
  receiptPdf!: string;

  @ManyToOne(()=> UsersClient, (usersClient)=> usersClient.id)
  @JoinColumn({name:"userClienteId"})
  userCliente!:UsersClient

  @ManyToOne(()=> User, (user)=> user.id)
  @JoinColumn({name:"userId"})
  user!:User  

  @ManyToOne(()=> LoanQuota, loanQuota=> loanQuota.id, {onDelete:'RESTRICT'})
  @JoinColumn({name:"loanQuotaId"})
  loanQuota!:LoanQuota
}


