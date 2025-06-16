import { ShareData } from 'src/share_data/entities/share_data.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true,unique: true })
  uid: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  contact: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user';

  @Column({ default: true })
  status: boolean;

  @Column()
  password: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @OneToMany(() => ShareData, shareData => shareData.user)
 shareData: ShareData[];
}
