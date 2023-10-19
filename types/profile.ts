export type ROLE = 'ADMIN' | 'CUSTOMER' | 'DEALER';

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  user_role: ROLE;
  created_at: string;
  ward: number;
}
