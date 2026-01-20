import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LandmarkService } from './landmark.service';
import { Landmark } from '../../entities/landmark.entity';

/**
 * 地标模块控制器
 * 路由前缀：/landmarks
 * 提供地标的增删改查接口
 */
@Controller('landmarks')
export class LandmarkController {
  constructor(private readonly landmarkService: LandmarkService) {}

  /**
   * 创建地标
   * @param data 地标数据（包含名称、地址、分类、坐标、事件等）
   */
  @Post()
  create(@Body() data: Partial<Landmark>) {
    return this.landmarkService.create(data);
  }

  /**
   * 获取地标列表
   * 如数据为空，会由服务层进行种子数据初始化
   */
  @Get()
  findAll() {
    return this.landmarkService.findAll();
  }

  /**
   * 获取单个地标详情
   * @param id 地标ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landmarkService.findOne(+id);
  }

  /**
   * 更新地标信息
   * @param id 地标ID
   * @param data 更新内容
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Landmark>) {
    return this.landmarkService.update(+id, data);
  }

  /**
   * 删除地标
   * @param id 地标ID
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landmarkService.remove(+id);
  }
}
