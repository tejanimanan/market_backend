import { ShareData } from 'src/share_data/entities/share_data.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Script {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true }) // ✅ Add this
  symbol: string;

  @Column('decimal', { precision: 10, scale: 2 })
  current_rate: number;

  @Column({ default: true })
  status: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  high_value: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  low_value: number;

  @Column('bigint', { nullable: true })
  volume: number;

  @Column({ type: 'enum', enum: ['NSE', 'BSE'], nullable: true })
  type: 'NSE' | 'BSE';

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  closing_price: number;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @OneToMany(() => ShareData, shareData => shareData.script)
  shareData: ShareData[];
}
