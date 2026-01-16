import api from './index';

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

export const createAppointment = (data: AppointmentData) => {
  return api.post('/appointments', data);
};
