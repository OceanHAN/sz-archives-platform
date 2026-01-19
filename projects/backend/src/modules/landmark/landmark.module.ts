import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandmarkService } from './landmark.service';
import { LandmarkController } from './landmark.controller';
import { Landmark } from '../../entities/landmark.entity';
import { LandmarkEvent } from '../../entities/landmark-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Landmark, LandmarkEvent])],
  controllers: [LandmarkController],
  providers: [LandmarkService],
})
export class LandmarkModule {}
