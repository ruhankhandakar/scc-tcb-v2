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
