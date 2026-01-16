import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('t_news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 255, nullable: true })
  cover_image: string;

  @Column({ length: 200, nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'datetime' })
  publish_time: Date;

  @CreateDateColumn()
  create_time: Date;
}
