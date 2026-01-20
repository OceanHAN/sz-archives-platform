import { Controller, Get, Query } from '@nestjs/common';
import { ArchiveService } from './archive.service';

/**
 * 档案控制器
 * 路由前缀：/archives
 */
@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  /**
   * 档案检索
   * @param q 关键字
   */
  @Get('search')
  async search(@Query('q') q = '') {
    return this.archiveService.search(q);
  }
}
