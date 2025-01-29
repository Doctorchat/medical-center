import { apiInstance } from '@/utils/api';
import { API_URL } from '@/utils/constants';
import { Appointment } from '@/types';

class ConsultationService {
  private consultationApi = apiInstance.extend({
    prefixUrl: `${API_URL}/medical-centre/consultations`,
  });

  getAll(params?: { search: string }) {
    return this.consultationApi
      .get(`all`, { searchParams: params })
      .json<{ data: Appointment[] }>();
  }

  cancel(consultation: number) {
    return this.consultationApi
      .put(`${consultation}/cancel`)
      .json<Appointment>();
  }

  confirm(consultation: number) {
    return this.consultationApi
      .put(`${consultation}/confirm`)
      .json<Appointment>();
  }

  complete(consultation: number) {
    return this.consultationApi
      .put(`${consultation}/complete`)
      .json<Appointment>();
  }

  modifyComment(consultation: number, comment: string | null) {
    return this.consultationApi
      .put(`${consultation}/modify-comment`, { json: { comment } })
      .json<Appointment>();
  }
}

export const consultationService = new ConsultationService();
