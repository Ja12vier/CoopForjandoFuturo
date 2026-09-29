import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { LoanCalculationType, LoanType, Payment, StateLoan } from '../dto/create-loan.dto';
import { LoanQuota } from 'src/modules/loan-quotas/entities/loan-quota.entity';
import { UsersClient } from 'src/modules/users-clients/entities/users-client.entity';
import { User } from 'src/modules/users/entities/user.entity';



@Entity()
export class Loan {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	amountAproved!: number;

	@Column('bigint')
	quotas!: number;

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	interestRate!: number;

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	interestTotal!: number;

	@Column({nullable:true})
	gracePeriodDays?: number;    // Dias de gracia PARA aplicar Mora, si no se especifica se toma 1 dias de gracia 
                                // osea al dia siguiente de la fecha de vencimiento de la cuota se aplica mora

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	loan!: number;

	@Column({type:'enum', enum:Payment, nullable:true, default:Payment.MONTHLY})
	payment!: Payment;

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	paidAmount!: number;

	@Column({ type: 'date' })
	dateStart!: Date;

	@Column({ type: 'date'})
	dateEnd!: Date;

	@Column({type:'enum', enum:LoanType, nullable:true, default:LoanType.PERSONAL })
	typeLoan!: string;

	@Column({type:'enum', enum:LoanCalculationType, default:LoanCalculationType.DECLINING_BALANCE})
	typeLaonCalculation!: string

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})   
	creditBalance!:number                                                   //saldo a favor

	@Column({default:StateLoan.PENDING, nullable:true, type:'enum', enum:StateLoan,})
	state!: string;

	@Column({ nullable: true })
	receiptPdf!: string;

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	amountDue!: number;

	@Column('decimal', {precision:10, scale:2, nullable:true, default:0.00})
	penaltyFeeTotal!: number;

	@Column({nullable: true })
	guarantourName!:string;

    @Column('bigint')
	userId!: number;

	@Column('bigint')
	userClientId!: number;
    
	@CreateDateColumn({type:'timestamp'})
	createdAt!:Date;
    
	@CreateDateColumn({type:'timestamp'})
	updatedAt!:Date

	@OneToMany(() => LoanQuota, (loanQuota) => loanQuota.loan, {cascade:true})
	loanQuotas!: LoanQuota[]	

	@ManyToOne(() => UsersClient, (userClient) => userClient.id, {onDelete:'CASCADE'})
	@JoinColumn({name: 'userClientId'})
	userClient!: UsersClient

    @ManyToOne(()=>User, (user) => user.id, {onDelete:'SET NULL'})
	@JoinColumn({name:'userId'})
	user!:User

	


}
