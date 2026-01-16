import { Controller, Get, Query } from '@nestjs/common';
import { ArchiveService } from './archive.service';

@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get('search')
  async search(@Query('q') q = '') {
    return this.archiveService.search(q);
  }
}

