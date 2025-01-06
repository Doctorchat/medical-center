const options = {
  method: 'POST',
  url: 'https://api-dev.doctorchat.md/api/medical-centre/profile',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization:
      'Bearer 56135|96GThEYPS5Y49l8RlKNT2pr0iptMcrdkKnjGwSDMcdf026e5',
  },
};

class ProfileService {
  private URL = `https://api-dev.doctorchat.md/api/medical-centre/profile`;

  getProfile() {
    return fetch(this.URL, options);
  }
}

export const profileService = new ProfileService();
