import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseOnline } from '../../entities/course-online.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseOnline)
    private courseRepository: Repository<CourseOnline>,
  ) {}

  findAll() {
    return this.courseRepository.find({
      order: { publish_date: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.courseRepository.findOneBy({ id });
  }

  create(data: Partial<CourseOnline>) {
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  async update(id: number, data: Partial<CourseOnline>) {
    await this.courseRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.courseRepository.delete(id);
  }
}