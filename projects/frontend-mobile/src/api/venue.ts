import axios from 'axios';

// 场馆相关 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

/**
 * 场馆条目
 * - capacity：容量/可容纳人数
 * - status：是否开放/启用
 */
export interface VenueItem {
  id: number;
  name: string;
  cover_image: string;
  description: string;
  capacity: number;
  status: boolean;
}

/**
 * 获取场馆列表
 */
export const getVenues = async (): Promise<VenueItem[]> => {
  const response = await api.get('/venues');
  return response.data;
};
