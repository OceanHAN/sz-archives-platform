import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(data: Partial<Appointment>): Promise<Appointment> {
    const bookingNo = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
    const appointment = this.appointmentRepository.create({
      ...data,
      booking_no: bookingNo,
      status: 0, // Pending
    });
    return this.appointmentRepository.save(appointment);
  }

  async findAllByUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { user_id: userId },
      order: { create_time: 'DESC' },
    });
  }

  async findAll(query: any = {}): Promise<Appointment[]> {
    const { biz_type, status } = query;
    const where: any = {};
    if (biz_type) where.biz_type = biz_type;
    if (status !== undefined && status !== '') where.status = Number(status);
    
    return this.appointmentRepository.find({
      where,
      order: { create_time: 'DESC' },
    });
  }

  async updateStatus(id: number, status: number): Promise<Appointment | null> {
    await this.appointmentRepository.update(id, { status });
    return this.appointmentRepository.findOneBy({ id });
  }
}
