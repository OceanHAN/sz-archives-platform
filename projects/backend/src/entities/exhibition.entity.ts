import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_exhibition')
export class Exhibition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 255 })
  cover_image: string;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 20, default: 'virtual' })
  type: string; // virtual, physical

  @Column({ default: true })
  status: boolean; // 1: published, 0: draft

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ type: 'datetime', nullable: true })
  start_date: Date;

  @Column({ type: 'datetime', nullable: true })
  end_date: Date;
}
