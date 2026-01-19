import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface LandmarkEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  image: string;
}

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

export const getLandmarks = async (): Promise<LandmarkItem[]> => {
  const response = await api.get('/landmarks');
  return response.data;
};

export const getLandmarkDetail = async (id: number): Promise<LandmarkItem> => {
  const response = await api.get(`/landmarks/${id}`);
  return response.data;
};
