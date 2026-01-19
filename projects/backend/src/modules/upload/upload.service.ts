import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getHello(): string {
    return 'Upload Service';
  }
}