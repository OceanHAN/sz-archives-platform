import api from './index';

export interface HistoricalMapItem {
  id: number;
  year: string;
  title: string;
  url: string;
  bounds: {
    southWest: { lat: number; lng: number };
    northEast: { lat: number; lng: number };
  };
  description?: string;
}

export const getHistoricalMaps = () => {
  return api.get<HistoricalMapItem[]>('/historical-maps');
};

export const getHistoricalMapDetail = (id: number) => {
  return api.get<HistoricalMapItem>(`/historical-maps/${id}`);
};
