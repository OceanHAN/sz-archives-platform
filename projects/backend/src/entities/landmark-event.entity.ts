import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Landmark } from './landmark.entity';

@Entity('t_landmark_event')
export class LandmarkEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  landmark_id: number;

  @ManyToOne(() => Landmark, (landmark) => landmark.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'landmark_id' })
  landmark: Landmark;

  @Column({ length: 20 })
  year: string; // e.g. "1925", "1949-10"

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @Column({ default: 0 })
  sort_order: number;
}
