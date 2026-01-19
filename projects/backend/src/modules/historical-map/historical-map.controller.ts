import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoricalMapService } from './historical-map.service';
import { HistoricalMap } from '../../entities/historical-map.entity';

@Controller('historical-maps')
export class HistoricalMapController {
  constructor(private readonly historicalMapService: HistoricalMapService) {}

  @Post()
  create(@Body() createHistoricalMapDto: Partial<HistoricalMap>) {
    return this.historicalMapService.create(createHistoricalMapDto);
  }

  @Get()
  findAll() {
    return this.historicalMapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicalMapService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoricalMapDto: Partial<HistoricalMap>) {
    return this.historicalMapService.update(+id, updateHistoricalMapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicalMapService.remove(+id);
  }
}
