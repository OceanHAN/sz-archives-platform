import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LandmarkService } from './landmark.service';
import { Landmark } from '../../entities/landmark.entity';

@Controller('landmarks')
export class LandmarkController {
  constructor(private readonly landmarkService: LandmarkService) {}

  @Post()
  create(@Body() data: Partial<Landmark>) {
    return this.landmarkService.create(data);
  }

  @Get()
  findAll() {
    return this.landmarkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landmarkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Landmark>) {
    return this.landmarkService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landmarkService.remove(+id);
  }
}
