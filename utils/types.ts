import { DocumentPickerAsset } from 'expo-document-picker';

export type ROLE = 'ADMIN' | 'CUSTOMER' | 'DEALER';
export interface StoreFileInBucketParamType {
  fileURI: string;
  filePath: string;
  contentType: string;
  folderName: string;
  keyName: string;
  bucketName?: string;
  isPublic?: boolean;
}

export interface ProfileDBPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  ward: number;
  document_proof_link: string[] | null;
  profile_picture: string | null;
  deo_documents: string[] | null;
}

export interface UpdateParams {
  firstName: string;
  lastName: string;
  password: string;
  profilePicture: DocumentPickerAsset | null | undefined;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
}

export type ConfigName = 'max_num_scanned_allowed_month';

export type OtherConfigsData = {
  config_name: ConfigName;
  config_value: string;
};

export type OtherConfigsState = {
  maxNumScannedAllowedMonth: number;
};

export type CustomerEntrySubmitParams = {
  productLists: {
    name: string;
    quantity: string;
  }[];
  customerId: number;
};

export interface ScannedDataParam {
  user_id: string;
  customer_id: number;
  dealer_id: number;
  other_data: any;
}

export type CustomerType = 'registered' | 'privileged';

export type GetTotalCustomerParams = {
  customerType: CustomerType;
  wardNum?: number;
  dealerId?: number;
};
