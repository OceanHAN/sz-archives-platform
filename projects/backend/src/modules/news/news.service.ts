import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../../entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(data: Partial<News>): Promise<News> {
    const news = this.newsRepository.create(data);
    return this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    const count = await this.newsRepository.count();
    if (count === 0) {
      await this.seedData();
    }
    return this.newsRepository.find({
      order: { publish_time: 'DESC' },
    });
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async update(id: number, data: Partial<News>): Promise<News> {
    await this.newsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.newsRepository.delete(id);
  }

  private async seedData() {
    const newsList = [
      {
        title: '深圳市档案馆开展“6·9国际档案日”系列宣传活动',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=archives_day_event&image_size=landscape_4_3',
        summary: '今年6月9日是第16个国际档案日，深圳市档案馆围绕“奋进新征程·兰台谱新篇”主题，开展了丰富多彩的系列宣传活动。',
        content: '<p>今年6月9日是第16个国际档案日，深圳市档案馆围绕“奋进新征程·兰台谱新篇”主题，开展了丰富多彩的系列宣传活动。</p><p>活动当天，档案馆举办了主题展览开放日，邀请市民走进档案库房，近距离感受档案文化的魅力。同时，线上推出了“兰台云讲堂”，邀请专家学者解读档案背后的故事。</p>',
        publish_time: new Date('2023-06-09'),
      },
      {
        title: '关于恢复对外开放的公告',
        cover_image: '',
        summary: '深圳市档案馆将于2023年5月15日起恢复对外开放，欢迎广大市民前来查阅档案和参观展览。',
        content: '<p>尊敬的市民朋友们：</p><p>深圳市档案馆将于2023年5月15日起恢复对外开放。现将有关事项公告如下：</p><p>一、开放时间：周一至周五 9:00-17:00。</p><p>二、查档须知：请携带本人有效身份证件。</p>',
        publish_time: new Date('2023-05-15'),
      },
      {
        title: '“兰台讲堂”第五期顺利开讲，专家解读城市记忆',
        cover_image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=history_lecture&image_size=landscape_4_3',
        summary: '本期讲堂邀请了著名历史学家王教授，为大家生动讲述了深圳经济特区建立初期的奋斗历程。',
        content: '<p>本期讲堂邀请了著名历史学家王教授，为大家生动讲述了深圳经济特区建立初期的奋斗历程。</p><p>王教授结合珍贵的档案史料，回顾了那段激情燃烧的岁月，赢得了现场观众的阵阵掌声。</p>',
        publish_time: new Date('2023-05-10'),
      }
    ];

    for (const item of newsList) {
      await this.newsRepository.save(item);
    }
  }
}
