import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibition } from '../../entities/exhibition.entity';

@Injectable()
export class ExhibitionService {
  constructor(
    @InjectRepository(Exhibition)
    private exhibitionRepository: Repository<Exhibition>,
  ) {}

  async findAll(): Promise<Exhibition[]> {
    // If empty, seed some data for demo
    const count = await this.exhibitionRepository.count();
    if (count === 0) {
      await this.seedData();
    }
    return this.exhibitionRepository.find({
      order: { sort_order: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Exhibition> {
    const item = await this.exhibitionRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Exhibition with ID ${id} not found`);
    }
    return item;
  }

  async create(data: Partial<Exhibition>): Promise<Exhibition> {
    const exhibition = this.exhibitionRepository.create(data);
    return this.exhibitionRepository.save(exhibition);
  }

  async update(id: number, data: Partial<Exhibition>): Promise<Exhibition> {
    await this.exhibitionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.exhibitionRepository.delete(id);
  }

  private async seedData() {
    const exhibitions = [
      {
        title: '大道同行 海纳百川',
        cover_image: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=800',
        summary: '从“丝绸之路”的历史回响到“一带一路”的深圳实践',
        content: '展览详情内容...',
        type: 'virtual',
        status: true,
        sort_order: 10,
      },
      {
        title: '深圳记忆：城市发展史',
        cover_image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800',
        summary: '记录深圳从小渔村到国际化大都市的变迁',
        type: 'virtual',
        status: true,
        sort_order: 9,
      },
      {
        title: '红色档案见证百年',
        cover_image: 'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?q=80&w=800',
        summary: '庆祝中国共产党成立100周年特展',
        type: 'physical',
        status: true,
        sort_order: 8,
      },
    ];

    for (const item of exhibitions) {
      await this.exhibitionRepository.save(item);
    }
  }
}
