
import { StateLoan } from 'src/modules/loans/dto/create-loan.dto';
import { Loan } from 'src/modules/loans/entities/loan.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { UsersClient } from 'src/modules/users-clients/entities/users-client.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';


export enum PaymentTipe{
    MONTHLY='Monthly',
    BIWEEKLY='Biweekly',
    WEEKLY='Weekly'
}

export enum ExcesPaymentAction{
  APPLY_TO_NEXT_INSTALLMENT = 'APPLY_TO_NEXT_INSTALLMENT',   //aplicar al siguiente pago
  CREDIT_BALANCE = 'CREDIT_BALANCE',                         //registrar como saldo a favor              //                                        
  REFUND = 'REFUND',                                         //Devolver el dinero al cliente
  CANCEL = 'CANCEL'                                          //cancelar la cuota

}


@Entity()
export class LoanQuota {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('bigint')
  numberQuota!: number;

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00})
  amountQuota!: number;

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00})
  interestQuota!: number;

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00})
  capitalQuota!: number;

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00})
  penaltyAmount!: number;

  @Column('int',{nullable:true, default:0})
  penaltyCount!: number;  // cantidad de penalidades aplicadas

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00, })
  debtQuota!: number;   //deuda

  @Column({ type: 'date' })
  datePay!: Date;

  @Column({type:'date', nullable:true})
  lastPenaltyDate!: Date;

  @Column('decimal',{precision:10, scale:2, nullable:true, default:0.00})
  installmentPayment!: number;

  @Column({type:'enum', enum:StateLoan, nullable:true, default:StateLoan.PENDING})
  status!: string;

  @Column({ type: 'enum', enum: PaymentTipe, nullable: true })
  payment!: String;

  @Column({type:'enum', enum:ExcesPaymentAction, nullable:true})
  action!: string

  @Column('bigint')
  loanId!: number;
  @Column('bigint')
  userClientId!: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({type: 'timestamp' })
  updatedAt!: Date

  @ManyToOne(() => Loan, (loan) => loan.loanQuotas, {onDelete:'CASCADE'})
  @JoinColumn({name: 'loanId'})
  loan!: Loan

  @OneToMany(() => Payment, (payment) => payment.loanQuota)
  payments!: Payment[]

  @ManyToOne(()=> UsersClient, (userrClient)=> userrClient.loanQuotas)
  @JoinColumn({name:"userClientId"})
  userClient!:UsersClient

}
