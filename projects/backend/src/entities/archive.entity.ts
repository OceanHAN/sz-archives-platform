import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_archive')
export class Archive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  archive_code: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content_desc: string;

  @Column({ nullable: true })
  category_id: number;

  @Column({ length: 10, nullable: true })
  year: string;

  @Column({ length: 100, nullable: true })
  location_ref: string;

  @Column({ length: 255, nullable: true })
  pdf_url: string;

  @Column({ default: true })
  is_open: boolean;
}
