import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';

/**
 * 展览控制器
 * 路由前缀：/exhibitions
 */
@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  /** 获取展览列表 */
  @Get()
  findAll() {
    return this.exhibitionService.findAll();
  }

  /** 获取展览详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionService.findOne(+id);
  }

  /** 创建展览 */
  @Post()
  create(@Body() data: any) {
    return this.exhibitionService.create(data);
  }

  /** 更新展览 */
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.exhibitionService.update(+id, data);
  }

  /** 删除展览 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionService.remove(+id);
  }
}
