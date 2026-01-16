import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('t_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  openid: string;

  @Column({ length: 64, nullable: true })
  unionid: string;

  @Column({ length: 64, nullable: true })
  nickname: string;

  @Column({ length: 255, nullable: true })
  avatar_url: string;

  @Column({ length: 255, nullable: true })
  mobile: string;

  @Column({ length: 50, nullable: true })
  real_name: string;

  @Column({ length: 255, nullable: true })
  id_card: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;
}
