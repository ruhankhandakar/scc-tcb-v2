import { Customer, DealerConfig, IWards } from 'types';

export type ROLE = 'ADMIN' | 'CUSTOMER' | 'DEALER';

// @ts-ignore
export interface ProfileData extends Partial<Customer> {
  deo_documents?: string[];
  first_name: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  last_name: string;
  profile_picture?: string;
  user_id: string;
  user_role: ROLE;
  ward: number;
  date_of_birth?: string;
  foundation_name?: string;
  remarks?: string | null;
  wards?: Partial<IWards>;
  dealer_config?: DealerConfig;
}

// @ts-ignore
export interface SelectedProfileData
  extends Partial<Customer>,
    Partial<ProfileData> {
  email?: string;
  phone_number: string;
  document_proof_number?: string;
  address?: string;
}
