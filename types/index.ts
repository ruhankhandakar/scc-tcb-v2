import type { ProfileData } from './profile';

export type ItemType = {
  label: string;
  value: number;
};

export interface IWards {
  created_at: string;
  id: number;
  is_active: boolean;
  name: string;
  profiles: ProfileData[] | [];
}

export type TWards = Omit<IWards, 'profiles'>;

export interface Customer {
  address: string;
  created_at: string;
  customer_id: number;
  document_proof_link?: string;
  document_proof_name: string;
  document_proof_number: string;
  family_card?: string;
  profile_pic?: string;
  gurdian_name: string;
  id: number;
  is_active: boolean;
  mobile_number: string;
  name: string;
  union: string;
  ward: number;
  wards: IWards;
}

export interface Products {
  id: number;
  is_active: boolean;
  product_name: string;
  created_at: string;
  quantity: string;
}

export type StatusType = 'IDLE' | 'CANCEL' | 'SUCCESS' | 'VIEW' | '';

export type FileUploadDocumentKeyName =
  | 'profilePicture'
  | 'nidDocuments'
  | 'deoDocument';
