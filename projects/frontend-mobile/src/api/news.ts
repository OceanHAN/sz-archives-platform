import api from './index';

/**
 * 新闻条目
 * - cover_image：封面图（可选）
 * - publish_time：发布时间（字符串）
 */
export interface NewsItem {
  id: number;
  title: string;
  cover_image?: string;
  summary: string;
  content: string;
  publish_time: string;
}

/**
 * 获取新闻列表
 * 说明：部分后端可能直接返回数组，或包裹在 data 字段，这里做兼容处理
 */
export const getNews = async (): Promise<NewsItem[]> => {
  const response = await api.get('/news');
  return Array.isArray(response) ? response : (response as any).data || [];
};

/**
 * 获取新闻详情
 * @param id 新闻ID
 * 注意：如需严格类型，可改用 getJson<NewsItem>(...) 保证返回值类型
 */
export const getNewsDetail = async (id: number): Promise<NewsItem> => {
  const response = await api.get(`/news/${id}`);
  return response;
};
