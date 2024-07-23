interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AdditionalField {
  fieldName: string;
  fieldValue: string;
}

export interface Patient {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_of_birth: string;
  status_name?: string;
  status_id?: number;
  addresses: Address[];
  additional_fields: AdditionalField[];
}
