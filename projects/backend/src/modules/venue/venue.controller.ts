import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VenueService } from './venue.service';
import { Venue } from '../../entities/venue.entity';

/**
 * 场馆控制器
 * 路由前缀：/venues
 * 提供场馆的增删改查接口
 */
@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  /** 创建场馆 */
  @Post()
  create(@Body() data: Partial<Venue>) {
    return this.venueService.create(data);
  }

  /** 获取场馆列表（无数据时进行种子初始化） */
  @Get()
  findAll() {
    return this.venueService.findAll();
  }

  /** 获取场馆详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(+id);
  }

  /** 更新场馆信息 */
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Venue>) {
    return this.venueService.update(+id, data);
  }

  /** 删除场馆 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(+id);
  }
}
