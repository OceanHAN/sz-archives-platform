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
    // Only seed if empty to avoid constant updates/aborted requests
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
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=silk_road_exhibition&image_size=landscape_4_3',
        summary: '从“丝绸之路”的历史回响到“一带一路”的深圳实践',
        content: '展览详情内容...',
        type: 'virtual',
        status: true,
        sort_order: 10,
      },
      {
        title: '深圳记忆：城市发展史',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=shenzhen_history_museum&image_size=landscape_4_3',
        summary: '记录深圳从小渔村到国际化大都市的变迁',
        type: 'virtual',
        status: true,
        sort_order: 9,
      },
      {
        title: '红色档案见证百年',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=red_archives_exhibition&image_size=landscape_4_3',
        summary: '庆祝中国共产党成立100周年特展',
        type: 'physical',
        status: true,
        sort_order: 8,
      },
    ];

    for (const item of exhibitions) {
      // Use findOne to check if it exists by title to avoid duplicates but allow updates if needed
      // Or just clear and re-insert for seed
      const existing = await this.exhibitionRepository.findOneBy({ title: item.title });
      if (existing) {
        await this.exhibitionRepository.update(existing.id, item);
      } else {
        await this.exhibitionRepository.save(item);
      }
    }
  }
}
