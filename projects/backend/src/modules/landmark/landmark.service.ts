import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from '../../entities/landmark.entity';
import { LandmarkEvent } from '../../entities/landmark-event.entity';

@Injectable()
export class LandmarkService {
  constructor(
    @InjectRepository(Landmark)
    private landmarkRepository: Repository<Landmark>,
    @InjectRepository(LandmarkEvent)
    private eventRepository: Repository<LandmarkEvent>,
  ) {}

  async create(data: Partial<Landmark>): Promise<Landmark> {
    const events = data.events;
    delete data.events;
    
    const landmark = this.landmarkRepository.create(data);
    const savedLandmark = await this.landmarkRepository.save(landmark);

    if (events && events.length > 0) {
      for (const event of events) {
        const newEvent = this.eventRepository.create({
          ...event,
          landmark_id: savedLandmark.id,
        });
        await this.eventRepository.save(newEvent);
      }
    }

    return this.findOne(savedLandmark.id);
  }

  async findAll(): Promise<Landmark[]> {
    const count = await this.landmarkRepository.count();
    if (count === 0) {
      await this.seedData();
    }
    return this.landmarkRepository.find({
      order: { sort_order: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Landmark> {
    const landmark = await this.landmarkRepository.findOne({
      where: { id },
      relations: ['events'],
    });
    
    if (!landmark) {
      throw new NotFoundException(`Landmark with ID ${id} not found`);
    }
    
    // Sort events by year
    if (landmark.events) {
      landmark.events.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    }
    
    return landmark;
  }

  async update(id: number, data: Partial<Landmark>): Promise<Landmark> {
    const events = data.events;
    delete data.events;

    await this.landmarkRepository.update(id, data);

    if (events) {
      // Simple strategy: delete all old events and re-create (for MVP simplicity)
      // In production, you'd want to update existing ones by ID
      await this.eventRepository.delete({ landmark_id: id });
      for (const event of events) {
        const newEvent = this.eventRepository.create({
          ...event,
          landmark_id: id,
        });
        await this.eventRepository.save(newEvent);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.landmarkRepository.delete(id);
  }

  private async seedData() {
    const landmarks = [
      {
        name: '东江纵队纪念馆',
        address: '深圳市坪山区东纵路',
        category: 'red',
        latitude: 22.6934,
        longitude: 114.3642,
        summary: '展示广东人民抗日游击队东江纵队历史的专题纪念馆。',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=memorial_hall_red_history&image_size=landscape_4_3',
        sort_order: 10,
        events: [
          {
            year: '2000',
            title: '建成开馆',
            description: '东江纵队纪念馆正式建成并对外开放，成为重要的爱国主义教育基地。',
            image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=opening_ceremony_2000&image_size=landscape_4_3',
          },
          {
            year: '1943',
            title: '东江纵队成立',
            description: '广东人民抗日游击队东江纵队宣告成立，成为华南抗日战场的一支重要力量。',
            image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=historical_guerrilla_forces_1943&image_size=landscape_4_3',
          }
        ]
      },
      {
        name: '深圳国贸大厦',
        address: '深圳市罗湖区人民南路',
        category: 'history',
        latitude: 22.5408,
        longitude: 114.1197,
        summary: '“三天一层楼”的“深圳速度”诞生地。',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=shenzhen_guomao_building_skyscraper&image_size=landscape_4_3',
        sort_order: 9,
        events: [
          {
            year: '1985',
            title: '竣工',
            description: '国贸大厦竣工，成为当时中国最高的建筑，象征着改革开放的蓬勃发展。',
            image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=skyscraper_completion_1985&image_size=landscape_4_3',
          },
          {
            year: '1992',
            title: '邓小平视察',
            description: '邓小平同志视察深圳并在国贸大厦发表重要讲话（南方谈话）。',
            image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=deng_xiaoping_southern_tour&image_size=landscape_4_3',
          }
        ]
      },
      {
        name: '大鹏所城',
        address: '深圳市大鹏新区',
        category: 'culture',
        latitude: 22.5956,
        longitude: 114.4712,
        summary: '深圳“鹏城”别名的源头，明清海防重镇。',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ancient_chinese_fortress_city_wall&image_size=landscape_4_3',
        sort_order: 8,
        events: [
          {
            year: '1394',
            title: '建城',
            description: '明洪武二十七年，大鹏守御千户所城建立。',
            image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ancient_construction_ming_dynasty&image_size=landscape_4_3',
          }
        ]
      }
    ];

    for (const item of landmarks) {
      await this.create(item as any);
    }
  }
}
