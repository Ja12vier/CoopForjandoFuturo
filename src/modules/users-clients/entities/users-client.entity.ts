import { LoanQuota } from 'src/modules/loan-quotas/entities/loan-quota.entity';
import { Loan } from 'src/modules/loans/entities/loan.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { SavingsWithdrawal } from 'src/modules/savings-withdrawals/entities/savings-withdrawal.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

enum levelRisk{
  UNKNOWN = 'UNKNOWN',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

enum Status{
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELINQUENT = 'DELINQUENT',
  RETIRED = 'RETIRED',
}

@Entity()
export class UsersClient {2
	@PrimaryGeneratedColumn()
	id!: number;

    @Column({unique:true})
	numberAccount!: string;

	@Column()
	name!: string;

	@Column({
	 nullable:true,
	 unique:true,
	 length:12
	})
	phone!: string;

	@Column({nullable:true, unique:true})
	email!: string;

	@Column({
	unique:true,
	length:13
    })
	numberCard!: string;

	@Column('decimal', {precision:10, scale:2, nullable:true, default: 0.00})
	balanceCurrent!: number;

	@Column('decimal', {precision:10, scale:2, nullable:true, default: 0.00})
	retireTotal!: number;

	@Column({nullable:true, default:0})
	activeLoans!: number;

	@Column()
	address!: string;

	@Column('decimal', {precision:10, scale:2, nullable:true,  default:0.00})
	contributions!: number;

	@Column({nullable:true, default:0})
	totalLoans!: number;

	@Column({
	type: 'enum',
	enum: levelRisk,
	default: levelRisk.UNKNOWN
    })
	levelRisk!:string;

	@Column({type:'date', nullable: true })
	dateEntry!: Date;

	@Column({
	type: 'enum',
	enum: Status,
	default: Status.ACTIVE
	})
	state!: string;

	@CreateDateColumn({type:'timestamp'})
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp'})
	updatedAt!: Date;

	@Column('bigint', { nullable: true })
	userId!: number;

	@ManyToOne(() => User, (user) => user.usersClient, {onDelete:'SET NULL'})
	@JoinColumn({name:'userId'})
    user!: User;

	@OneToMany(() => SavingsWithdrawal, (savingsWithdrawal) => savingsWithdrawal.userClient, {cascade:true})
	savingsWithdrawal!: SavingsWithdrawal[];

	@OneToMany(()=>Loan, (loan)=>loan.userClient, {cascade:true})
	loan!: Loan[]

	@OneToMany(()=>Payment, (payment)=>payment.userCliente, {cascade:true})
	payment!: Payment[]

	@OneToMany(()=> LoanQuota, (loanQuota)=>loanQuota.userClient, {cascade:true})
	loanQuotas!: LoanQuota[]
}

   
