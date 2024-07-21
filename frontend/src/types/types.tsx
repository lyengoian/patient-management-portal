export interface DialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    patientId?: number | null;
    setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenError: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedIndex?: React.Dispatch<React.SetStateAction<number | null>>;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
    loadPatients?: () => void;
    setStatusError?: React.Dispatch<React.SetStateAction<string>>;
    statuses?: Status[];
    statusError?: string;
}

export interface PasswordResetFormProps {
    setIsResettingPassword: (open: boolean) => void;
}

export interface Status {
    id: number;
    status_name: string;
}

export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface AdditionalField {
    fieldName: string;
    fieldType: 'text' | 'number';
    fieldValue: string;
}

export interface Patient {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    status_id: number;
    address: Address;
    additional_fields: AdditionalField[];
}

export interface InfoCardProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    patientId: number | null;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
