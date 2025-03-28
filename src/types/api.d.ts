export interface ApiError extends Error {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export enum UserGender {
  MALE = 'm',
  FEMALE = 'f',
}

// Response interface for register
export interface SignUpResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  lastOrderDate: Date;
  role: string;
}

export type ServiceResponse<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export type Pagination<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

type Product = BaseModel & {
  name: string;
  genericName: string;
  description: string;
  priority: number;
  manufacturer: Manufacturer;
  images: Image[];
  categories: Category[];
};

export type ProductPresentation = BaseModel & {
  price: number;
  presentation: Presentation;
  product: Product;
};
