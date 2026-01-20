import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from '../../entities/news.entity';

/**
 * 资讯控制器
 * 路由前缀：/news
 */
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /** 发布资讯 */
  @Post()
  create(@Body() data: Partial<News>) {
    return this.newsService.create(data);
  }

  /** 获取资讯列表（无数据时进行种子初始化） */
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  /** 获取资讯详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  /** 更新资讯 */
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<News>) {
    return this.newsService.update(+id, data);
  }

  /** 删除资讯 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
