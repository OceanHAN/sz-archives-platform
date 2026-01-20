import api from './index';

/**
 * 预约数据模型
 * - biz_type：业务类型（如 'archive'、'exhibition'）
 * - biz_id：业务ID（档案ID、展览ID等）
 * - booking_date/time_slot：预约日期与时间段
 */
export interface AppointmentData {
  user_id?: number;
  biz_type: string;
  biz_id: number;
  booking_date: string;
  time_slot: string;
  contact_name: string;
  contact_phone: string;
  visitor_count: number;
}

/**
 * 创建预约
 * @param data 预约表单数据
 */
export const createAppointment = (data: AppointmentData) => {
  return api.post('/appointments', data);
};
