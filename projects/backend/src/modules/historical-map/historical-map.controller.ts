import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoricalMapService } from './historical-map.service';
import { HistoricalMap } from '../../entities/historical-map.entity';

/**
 * 历史地图控制器
 * 路由前缀：/historical-maps
 * 管理历史地图底图及范围
 */
@Controller('historical-maps')
export class HistoricalMapController {
  constructor(private readonly historicalMapService: HistoricalMapService) {}

  /** 创建历史地图 */
  @Post()
  create(@Body() createHistoricalMapDto: Partial<HistoricalMap>) {
    return this.historicalMapService.create(createHistoricalMapDto);
  }

  /** 获取历史地图列表 */
  @Get()
  findAll() {
    return this.historicalMapService.findAll();
  }

  /** 获取历史地图详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicalMapService.findOne(+id);
  }

  /** 更新历史地图 */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoricalMapDto: Partial<HistoricalMap>) {
    return this.historicalMapService.update(+id, updateHistoricalMapDto);
  }

  /** 删除历史地图 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicalMapService.remove(+id);
  }
}
