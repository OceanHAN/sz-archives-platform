import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_course_online')
export class CourseOnline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 200, nullable: true })
  subtitle: string;

  @Column({ length: 255 })
  cover_image: string;

  @Column({ length: 500 })
  video_url: string;

  @Column({ default: 0 })
  duration: number; // seconds

  @Column({ type: 'date' })
  publish_date: string;

  @Column({ length: 255, nullable: true })
  tags: string;

  @Column({ default: 0 })
  view_count: number;
}
