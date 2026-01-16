import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Archive } from '../../entities/archive.entity';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(Archive)
    private archiveRepository: Repository<Archive>,
  ) {}

  async ensureSeed() {
    const count = await this.archiveRepository.count();
    if (count === 0) {
      const seed: Partial<Archive>[] = [
        {
          archive_code: 'SZ-ARCH-0001',
          title: '深圳经济特区成立批文',
          content_desc:
            '关于深圳经济特区设立的相关政府批文与会议记录，记录改革开放初期的重要决策。',
          year: '1980',
          location_ref: '深圳市档案馆 综合库',
          pdf_url: 'https://example.com/docs/sz-arch-0001.pdf',
          is_open: true,
        },
        {
          archive_code: 'SZ-ARCH-0002',
          title: '蛇口工业区建设资料汇编',
          content_desc:
            '包含建设规划、工程图纸与阶段性总结，见证深圳工业化早期发展。',
          year: '1982',
          location_ref: '深圳市档案馆 工业卷宗库',
          pdf_url: 'https://example.com/docs/sz-arch-0002.pdf',
          is_open: true,
        },
        {
          archive_code: 'SZ-ARCH-0101',
          title: '深圳地铁一期工程档案',
          content_desc:
            '地铁一期的立项、施工记录与竣工验收文件，包含关键技术节点说明。',
          year: '2004',
          location_ref: '深圳市档案馆 工程建设库',
          pdf_url: 'https://example.com/docs/sz-arch-0101.pdf',
          is_open: true,
        },
      ];
      for (const item of seed) {
        await this.archiveRepository.save(item);
      }
    }
  }

  async search(q: string): Promise<Archive[]> {
    await this.ensureSeed();
    if (!q) {
      return this.archiveRepository.find({
        where: { is_open: true },
        take: 20,
        order: { year: 'DESC' },
      });
    }
    const like = `%${q}%`;
    return this.archiveRepository.find({
        where: [
          { title: Like(like), is_open: true },
          { content_desc: Like(like), is_open: true },
          { archive_code: Like(like), is_open: true },
        ],
        take: 20,
        order: { year: 'DESC' },
    });
  }
}

