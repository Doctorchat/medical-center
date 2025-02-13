import { apiInstance } from "@/utils/api";
import { API_URL } from "@/utils/constants";
import { IConsultation, IConsultationResponse, IKanban } from "@/types";

type CommentData = {
  comment: string | null;
  start_time: string | null;
  end_time: string | null;
};

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

  modifyLead(consultation: number, data: CommentData) {
    return this.consultationApi
      .put(`${consultation}/modify-lead`, { json: { ...data } })
      .json<IConsultation>();
  }
}

export const consultationService = new ConsultationService();
