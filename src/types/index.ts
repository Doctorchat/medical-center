import { MenuProps } from 'antd';

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

export type MenuItem = Required<MenuProps>['items'][number];
