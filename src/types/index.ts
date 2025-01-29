import { MenuProps } from "antd";

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

export interface IParams {
  id?: string;
}

export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

export interface IParamsAndSearchParams {
  params?: IParams;
  searchParams?: ISearchParams;
}

export type MenuItem = Required<MenuProps>["items"][number];

// Consultations
export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface IDoctor {
  id: number;
  name: string;
}

export interface IConsultation {
  id: number;
  user: IUser;
  doctor: IDoctor;
  medical_centre: IMedicalCentre;
  physical_slot_id: number;
  status: number;
  comment: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface IPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface IPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IPaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IPaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface IConsultationResponse {
  data: IConsultation[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}
