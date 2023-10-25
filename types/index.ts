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

interface Product {
  name: string;
  quantity: string;
}

export interface Customer {
  address: string;
  created_at: string;
  customer_id: number;
  document_proof_link?: string[];
  document_proof_name: string;
  document_proof_number: string;
  family_card?: string;
  profile_pic?: string;
  gurdian_name: string;
  id: number;
  is_active: boolean;
  phone_number: string;
  name: string;
  union: string;
  ward: number;
  wards: IWards;
  other_data?: {
    product_lists: Products[];
  };
  scanned_date?: string;
}

export interface ScannedData {
  id: number;
  created_at: string;
  user_id: string;
  other_data: {
    product_lists: Product[];
  };
  dealer_id: number;
  customer_id: number;
  customers: Customer;
}

export interface Products {
  id: number;
  is_active: boolean;
  product_name: string;
  name?: string;
  created_at: string;
  quantity: string;
  unit: string;
  per_unit_price: string;
}

export type StatusType = 'IDLE' | 'CANCEL' | 'SUCCESS' | 'VIEW' | '';

export type FileUploadDocumentKeyName =
  | 'profilePicture'
  | 'nidDocuments'
  | 'deoDocument';

export interface DealerConfig {
  id: number;
  dealer_id: string;
  privileged_customer: number;
  registered_customer: number;
  other_config: any;
}

export interface CardAndDealerCheck {
  dealerId: number;
  customerId: number;
  wardNumber: number;
}
