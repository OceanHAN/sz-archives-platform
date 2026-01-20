import api from './index';

/**
 * 档案条目
 * - archive_code：档号
 * - pdf_url：电子版地址（可选）
 * - is_open：是否开放查阅
 */
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

/**
 * 档案检索
 * @param q 关键字
 * @returns 匹配到的档案列表
 */
export const searchArchives = (q: string) => {
  return api.get<any, ArchiveItem[]>('/archives/search', { params: { q } });
};
