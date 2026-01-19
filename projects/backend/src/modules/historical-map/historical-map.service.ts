import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalMap } from '../../entities/historical-map.entity';

@Injectable()
export class HistoricalMapService implements OnModuleInit {
  constructor(
    @InjectRepository(HistoricalMap)
    private historicalMapRepository: Repository<HistoricalMap>,
  ) {}

  async onModuleInit() {
    // Seed data if empty
    const count = await this.historicalMapRepository.count();
    if (count === 0) {
      await this.seedData();
    }
  }

  async create(data: Partial<HistoricalMap>): Promise<HistoricalMap> {
    const map = this.historicalMapRepository.create(data);
    return this.historicalMapRepository.save(map);
  }

  async findAll(): Promise<HistoricalMap[]> {
    return this.historicalMapRepository.find({
      order: { year: 'ASC' },
    });
  }

  async findOne(id: number): Promise<HistoricalMap> {
    const map = await this.historicalMapRepository.findOne({ where: { id } });
    if (!map) {
      throw new Error(`Historical Map with ID ${id} not found`);
    }
    return map;
  }

  async update(id: number, data: Partial<HistoricalMap>): Promise<HistoricalMap> {
    await this.historicalMapRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.historicalMapRepository.delete(id);
  }

  private async seedData() {
    const maps = [
      {
        year: '1979',
        title: '1979年珠江三角洲卫星影像（改革开放前）',
        description: 'NASA Landsat 3卫星拍摄。此时深圳经济特区尚未建立，大部分地区仍为农田和渔村，绿色植被覆盖率极高。',
        url: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/7000/7949/shenzhen_mss_1979_lrg.jpg',
        // Approximate bounds for the Pearl River Delta satellite image
        bounds: {
          southWest: { lat: 21.8, lng: 112.9 },
          northEast: { lat: 23.4, lng: 114.8 },
        },
      },
      {
        year: '2003',
        title: '2003年珠江三角洲卫星影像（城市化高速期）',
        description: 'NASA Landsat 7卫星拍摄。经过20多年的飞速发展，深圳及周边城市群已连成一片，灰色建筑用地大幅取代了原有的植被。',
        url: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/7000/7949/shenzhen_etm_2003_lrg.jpg',
        bounds: {
          southWest: { lat: 21.8, lng: 112.9 },
          northEast: { lat: 23.4, lng: 114.8 },
        },
      },
    ];

    // Clear existing data to re-seed with real data
    await this.historicalMapRepository.clear();

    for (const map of maps) {
      await this.create(map);
    }
    console.log('Historical Map data seeded successfully with REAL NASA imagery');
  }
}
