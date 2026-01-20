import api from './index';

/**
 * 课程条目
 * - cover_image：封面图
 * - video_url：课程视频地址
 * - duration：时长（分钟）
 */
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

/**
 * 获取课程列表
 * 兼容部分后端直接返回数组或包裹在 data
 */
export const getCourses = async (): Promise<CourseItem[]> => {
  const response = await api.get('/courses');
  // 如果 response.data 已经是数据数组，直接返回；否则如果 response 本身是数组，返回 response
  return Array.isArray(response) ? response : (response as any).data || [];
};

/**
 * 获取课程详情
 * @param id 课程ID
 */
export const getCourseDetail = async (id: number): Promise<CourseItem> => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};
