import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Exhibition } from './entities/exhibition.entity';
import { ExhibitionScene } from './entities/exhibition-scene.entity';
import { CourseOnline } from './entities/course-online.entity';
import { CourseOffline } from './entities/course-offline.entity';
import { Appointment } from './entities/appointment.entity';
import { Archive } from './entities/archive.entity';
import { News } from './entities/news.entity';
import { Venue } from './entities/venue.entity';
import { Landmark } from './entities/landmark.entity';
import { LandmarkEvent } from './entities/landmark-event.entity';
import { HistoricalMap } from './entities/historical-map.entity';
import { ExhibitionModule } from './modules/exhibition/exhibition.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ArchiveModule } from './modules/archive/archive.module';
import { CourseModule } from './modules/course/course.module';
import { UploadModule } from './modules/upload/upload.module';
import { VenueModule } from './modules/venue/venue.module';
import { NewsModule } from './modules/news/news.module';
import { LandmarkModule } from './modules/landmark/landmark.module';
import { HistoricalMapModule } from './modules/historical-map/historical-map.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        User,
        Exhibition,
        ExhibitionScene,
        CourseOnline,
        CourseOffline,
        Appointment,
        Archive,
        News,
        Venue,
        Landmark,
        LandmarkEvent,
        HistoricalMap,
      ],
      synchronize: true,
    }),
    ExhibitionModule,
    AppointmentModule,
    ArchiveModule,
    CourseModule,
    UploadModule,
    VenueModule,
    NewsModule,
    LandmarkModule,
    HistoricalMapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
