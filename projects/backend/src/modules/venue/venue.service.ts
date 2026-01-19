import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from '../../entities/venue.entity';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  async findAll(): Promise<Venue[]> {
    const count = await this.venueRepository.count();
    if (count === 0) {
      await this.seedData();
    }
    return this.venueRepository.find({
      order: { sort_order: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venueRepository.findOneBy({ id });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  async create(data: Partial<Venue>): Promise<Venue> {
    const venue = this.venueRepository.create(data);
    return this.venueRepository.save(venue);
  }

  async update(id: number, data: Partial<Venue>): Promise<Venue> {
    await this.venueRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.venueRepository.delete(id);
  }

  private async seedData() {
    const venues = [
      {
        name: '一楼专题展厅',
        description: '主要展示近现代深圳档案及专题展览',
        capacity: 100,
        sort_order: 10,
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern_museum_hall_interior&image_size=landscape_4_3'
      },
      {
        name: '二楼常设展厅',
        description: '深圳城市发展史常设展览',
        capacity: 150,
        sort_order: 9,
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=exhibition_hall_with_historical_documents&image_size=landscape_4_3'
      },
      {
        name: '三楼多功能厅',
        description: '学术报告、文化讲座及临时特展',
        capacity: 200,
        sort_order: 8,
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=lecture_hall_auditorium_interior&image_size=landscape_4_3'
      }
    ];

    for (const item of venues) {
      await this.venueRepository.save(item);
    }
  }
}
