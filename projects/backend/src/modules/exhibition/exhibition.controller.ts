import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';

@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Get()
  findAll() {
    return this.exhibitionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionService.findOne(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.exhibitionService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.exhibitionService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionService.remove(+id);
  }
}
