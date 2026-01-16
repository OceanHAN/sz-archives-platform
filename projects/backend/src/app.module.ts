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
import { ExhibitionModule } from './modules/exhibition/exhibition.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ArchiveModule } from './modules/archive/archive.module';

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
      ],
      synchronize: true,
    }),
    ExhibitionModule,
    AppointmentModule,
    ArchiveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
