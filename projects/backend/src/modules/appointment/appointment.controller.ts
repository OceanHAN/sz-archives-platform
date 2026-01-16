import { Controller, Post, Body, Get, Query, Put, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() body: any) {
    const data = {
        ...body,
        user_id: body.user_id || 1,
        status: 0
    };
    return this.appointmentService.create(data);
  }

  @Get('my')
  findAllMy(@Query('userId') userId: string) {
    return this.appointmentService.findAllByUser(+userId || 1);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.appointmentService.findAll(query);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: number) {
    return this.appointmentService.updateStatus(+id, status);
  }
}
