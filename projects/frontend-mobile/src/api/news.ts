import api from './index';

export interface NewsItem {
  id: number;
  title: string;
  cover_image?: string;
  summary: string;
  content: string;
  publish_time: string;
}

export const getNews = async (): Promise<NewsItem[]> => {
  const response = await api.get('/news');
  return Array.isArray(response) ? response : (response as any).data || [];
};

export const getNewsDetail = async (id: number): Promise<NewsItem> => {
  const response = await api.get(`/news/${id}`);
  return response;
};
