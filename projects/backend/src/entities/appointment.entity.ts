import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('t_appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  booking_no: string;

  @Column()
  @Index()
  user_id: number;

  @Column({ length: 20 })
  biz_type: string; // exhibition, course, archive

  @Column()
  biz_id: number;

  @Column({ type: 'date' })
  @Index()
  booking_date: string;

  @Column({ length: 20 })
  time_slot: string;

  @Column({ default: 1 })
  visitor_count: number;

  @Column({ length: 50 })
  contact_name: string;

  @Column({ length: 20 })
  contact_phone: string;

  @Column({ length: 20, nullable: true })
  id_card: string;

  @Column({ length: 255, nullable: true })
  purpose: string;

  @Column({ default: 0 })
  status: number; // 0-pending, 1-completed, 2-cancelled, 3-expired

  @Column({ length: 255, nullable: true })
  qr_code: string;

  @Column({ type: 'datetime', nullable: true })
  checkin_time: Date;

  @CreateDateColumn()
  create_time: Date;
}
