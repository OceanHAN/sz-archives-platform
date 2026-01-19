import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalMapService } from './historical-map.service';
import { HistoricalMapController } from './historical-map.controller';
import { HistoricalMap } from '../../entities/historical-map.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricalMap])],
  controllers: [HistoricalMapController],
  providers: [HistoricalMapService],
})
export class HistoricalMapModule {}
