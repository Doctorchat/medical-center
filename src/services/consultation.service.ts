import { apiInstance } from "@/utils/api";
import { API_URL } from "@/utils/constants";
import { IConsultation, IConsultationResponse, IKanban } from "@/types";

class ConsultationService {
  private consultationApi = apiInstance.extend({
    prefixUrl: `${API_URL}/medical-centre/consultations`,
  });

  getAll(params?: { search?: string; per_page?: number; page?: number }) {
    return this.consultationApi
      .get(`all`, { searchParams: params })
      .json<IConsultationResponse>();
  }

  getKanban() {
    return this.consultationApi.get(`kanban`).json<IKanban>();
  }

  cancel(consultation: number) {
    return this.consultationApi
      .put(`${consultation}/cancel`)
      .json<IConsultation>();
  }

  confirm(consultation: number) {
    return this.consultationApi
      .put(`${consultation}/confirm`)
      .json<IConsultation>();
  }

  complete(consultation: number) {
    return this.consultationApi
      .put(`${consultation}/complete`)
      .json<IConsultation>();
  }

  modifyComment(consultation: number, comment: string | null) {
    return this.consultationApi
      .put(`${consultation}/modify-comment`, { json: { comment } })
      .json<IConsultation>();
  }
}

export const consultationService = new ConsultationService();
