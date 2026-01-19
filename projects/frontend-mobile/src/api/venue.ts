import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface VenueItem {
  id: number;
  name: string;
  cover_image: string;
  description: string;
  capacity: number;
  status: boolean;
}

export const getVenues = async (): Promise<VenueItem[]> => {
  const response = await api.get('/venues');
  return response.data;
};
