import { IWards } from 'types';

export type ROLE = 'ADMIN' | 'CUSTOMER' | 'DEALER';

export interface ProfileData {
  created_at: string;
  deo_documents?: string[];
  document_proof_link?: string[];
  first_name: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  last_name: string;
  profile_picture?: string;
  user_id: string;
  user_role: ROLE;
  ward: number;
  wards: Omit<IWards, 'profiles'>;
}
