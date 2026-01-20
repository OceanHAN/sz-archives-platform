import axios from 'axios';

// 独立的 axios 实例（展览相关）
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

/**
 * 展览条目
 * - type：展览类型（虚拟/实体）
 * - status：是否上线
 * - sort_order：排序值
 */
export interface ExhibitionItem {
  id: number;
  title: string;
  cover_image: string;
  summary: string;
  content?: string;
  type: 'virtual' | 'physical';
  status: boolean;
  sort_order: number;
}

/**
 * 获取展览列表
 */
export const getExhibitions = async (): Promise<ExhibitionItem[]> => {
  const response = await api.get('/exhibitions');
  return response.data;
};

/**
 * 获取展览详情
 * @param id 展览ID
 */
export const getExhibitionDetail = async (id: number): Promise<ExhibitionItem> => {
  const response = await api.get(`/exhibitions/${id}`);
  return response.data;
};
