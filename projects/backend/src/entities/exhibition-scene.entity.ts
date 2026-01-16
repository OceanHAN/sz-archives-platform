import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_exhibition_scene')
export class ExhibitionScene {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exhibition_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255 })
  thumb_url: string;

  @Column({ length: 255 })
  panorama_url: string;

  @Column({ type: 'text', nullable: true }) // SQLite stores JSON as text
  initial_view: string; 

  @Column({ type: 'text', nullable: true })
  hotspots: string;

  @Column({ default: 0 })
  sort_order: number;
}
