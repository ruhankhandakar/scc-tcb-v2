import { Customer, IWards } from 'types';

export type ROLE = 'ADMIN' | 'CUSTOMER' | 'DEALER';

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
  dateOfBirth?: string;
  foundation_name?: string;
}

export interface SelectedProfileData
  extends Partial<Customer>,
    Partial<ProfileData> {
  email?: string;
  phone_number: string;
  document_proof_number?: string;
  address?: string;
}
