export interface IMedicalCentre {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo: IUploadResource;
  created_at: string;
  updated_at: string;
}

export interface IUploadResource {
  id: number;
  name: string;
  extension: string;
  mime_type: string;
  size: number;
  url: string;
}

export interface ILoginResponse {
  token: string;
  type: string;
  medicalCentre: IMedicalCentre;
}

export interface ILogin {
  email: string;
  password: string;
}
