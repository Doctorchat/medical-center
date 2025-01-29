import { API_URL } from "@/utils/constants";
import { apiInstance } from "@/utils/api";
import type { IMedicalCentre } from "@/types";

class ProfileService {
  private api = apiInstance.extend({
    prefixUrl: `${API_URL}/medical-centre`,
  });

  async get() {
    const res = await this.api.get(`profile`).json<{ data: IMedicalCentre }>();
    return res?.data;
  }
}

export const profileService = new ProfileService();
