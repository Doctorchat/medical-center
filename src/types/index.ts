interface ILoginResponse {
  token: string;
  type: string;
  medicalCentre: {
    name: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    logo: {
      id: number;
      url: string;
    };
    created_at: string;
    updated_at: string;
  };
}
