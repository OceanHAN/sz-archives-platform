import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HistoricalMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column('simple-json')
  bounds: {
    southWest: { lat: number; lng: number };
    northEast: { lat: number; lng: number };
  };

  @Column({ type: 'text', nullable: true })
  description: string;
}
