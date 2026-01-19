import api from './index';

export interface CourseItem {
  id: number;
  title: string;
  subtitle?: string;
  cover_image: string;
  video_url: string;
  duration: number;
  publish_date: string;
  tags?: string;
  view_count: number;
}

export const getCourses = async (): Promise<CourseItem[]> => {
  const response = await api.get('/courses');
  // 如果 response.data 已经是数据数组，直接返回；否则如果 response 本身是数组，返回 response
  return Array.isArray(response) ? response : (response as any).data || [];
};

export const getCourseDetail = async (id: number): Promise<CourseItem> => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};