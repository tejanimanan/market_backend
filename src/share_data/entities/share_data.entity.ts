import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Script } from '../../script/entities/script.entity';

@Entity()
export class ShareData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.shareData, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Script, script => script.shareData, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'script_id' })
  script: Script;

  @Column('int')
  qty: number;

  @Column({ type: 'enum', enum: ['sell', 'buy'] })
  type: 'sell' | 'buy';

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  profit_loss: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  avgPrice: number;

  @Column({ type: 'enum', enum: ['open', 'close'], default: 'open' })
  position: 'open' | 'close';

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
