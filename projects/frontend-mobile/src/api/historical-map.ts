import { getJson } from './index'; // 统一的类型安全请求封装

/**
 * 历史地图数据模型
 * - year：地图所属年份（如 "1980"）
 * - url：历史底图图片地址（本地或远程）
 * - bounds：图片在地图上的地理范围（用于叠加定位）
 */
export interface HistoricalMapItem {
  id: number;
  year: string; // 年份字符串，便于展示
  title: string;
  url: string; // 覆盖层图片地址
  bounds: {
    // 西南角（左下）坐标
    southWest: { lat: number; lng: number };
    // 东北角（右上）坐标
    northEast: { lat: number; lng: number };
  };
  description?: string; // 可选的文字说明
}

/**
 * 获取历史地图列表
 * 返回所有可供选择的历史底图（含年份与范围）
 */
export const getHistoricalMaps = async (): Promise<HistoricalMapItem[]> => {
  return await getJson<HistoricalMapItem[]>('/historical-maps');
};

/**
 * 获取单个历史地图详情
 * @param id 历史地图ID
 */
export const getHistoricalMapDetail = async (id: number): Promise<HistoricalMapItem> => {
  return await getJson<HistoricalMapItem>(`/historical-maps/${id}`);
};
