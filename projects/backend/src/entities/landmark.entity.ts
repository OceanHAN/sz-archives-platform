import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LandmarkEvent } from './landmark-event.entity';

@Entity('t_landmark')
export class Landmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 50 })
  category: string; // red, history, culture, hotspot

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ length: 255, nullable: true })
  cover_image: string;

  @OneToMany(() => LandmarkEvent, (event) => event.landmark, {
    cascade: true,
  })
  events: LandmarkEvent[];

  @Column({ default: 0 })
  sort_order: number;
}
