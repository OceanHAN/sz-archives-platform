import { Controller, Post, Body, Get, Query, Put, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

/**
 * 预约控制器
 * 路由前缀：/appointments
 */
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * 创建预约
   * 默认 user_id 为 1（示例）
   * 初始状态 status=0
   */
  @Post()
  create(@Body() body: any) {
    const data = {
        ...body,
        user_id: body.user_id || 1,
        status: 0
    };
    return this.appointmentService.create(data);
  }

  /** 查询我的预约列表（按 userId） */
  @Get('my')
  findAllMy(@Query('userId') userId: string) {
    return this.appointmentService.findAllByUser(+userId || 1);
  }

  /** 查询全部预约（支持 query 条件） */
  @Get()
  findAll(@Query() query: any) {
    return this.appointmentService.findAll(query);
  }

  /** 更新预约状态 */
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: number) {
    return this.appointmentService.updateStatus(+id, status);
  }
}
