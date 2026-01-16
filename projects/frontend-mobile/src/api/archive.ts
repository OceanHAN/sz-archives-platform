import api from './index';

export interface ArchiveItem {
  id: number;
  archive_code: string;
  title: string;
  content_desc?: string;
  category_id?: number;
  year?: string;
  location_ref?: string;
  pdf_url?: string;
  is_open: boolean;
}

export const searchArchives = (q: string) => {
  return api.get<any, ArchiveItem[]>('/archives/search', { params: { q } });
};

