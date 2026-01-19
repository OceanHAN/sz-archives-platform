import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_venue')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  cover_image: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ default: 50 })
  capacity: number; // Max visitors per time slot

  @Column({ default: true })
  status: boolean; // 1: Open, 0: Closed

  @Column({ default: 0 })
  sort_order: number;
}
