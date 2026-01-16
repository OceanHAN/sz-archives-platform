import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_course_offline')
export class CourseOffline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 255 })
  cover_image: string;

  @Column({ length: 20 })
  category: string; // party, ideology, activity

  @Column({ default: false })
  is_deliverable: boolean;

  @Column({ type: 'text', nullable: true })
  detail_html: string;

  @Column({ default: 1 })
  min_group_size: number;
}
