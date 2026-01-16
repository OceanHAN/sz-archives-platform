import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

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

export const getExhibitions = async (): Promise<ExhibitionItem[]> => {
  const response = await api.get('/exhibitions');
  return response.data;
};

export const getExhibitionDetail = async (id: number): Promise<ExhibitionItem> => {
  const response = await api.get(`/exhibitions/${id}`);
  return response.data;
};