import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CourseService } from './course.service';

/**
 * 课程控制器
 * 路由前缀：/courses
 */
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /** 获取课程列表 */
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  /** 获取课程详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  /** 创建课程 */
  @Post()
  create(@Body() data: any) {
    return this.courseService.create(data);
  }

  /** 更新课程 */
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.courseService.update(+id, data);
  }

  /** 删除课程 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
