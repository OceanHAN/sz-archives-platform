import { getJson } from './index'; // 使用统一的 JSON 请求封装

/**
 * 地标事件（历史沿革时间线）
 */
export interface LandmarkEvent {
  id: number;
  year: string; // 事件发生年份
  title: string;
  description: string;
  image: string;
}

/**
 * 地标条目
 * - latitude/longitude：地理坐标，用于在地图上定位
 * - events：历史沿革事件列表
 */
export interface LandmarkItem {
  id: number;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  summary: string;
  cover_image: string;
  events: LandmarkEvent[];
}

/**
 * 获取地标列表
 */
export const getLandmarks = async (): Promise<LandmarkItem[]> => {
  return await getJson<LandmarkItem[]>('/landmarks');
};

/**
 * 获取地标详情
 * @param id 地标ID
 */
export const getLandmarkDetail = async (id: number): Promise<LandmarkItem> => {
  return await getJson<LandmarkItem>(`/landmarks/${id}`);
};
