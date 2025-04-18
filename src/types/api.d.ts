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

export interface ProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  birthDate: Date;
  gender: string;
  profilePicture: string;
  role: string;
}

type UserList = BaseModel & {
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  lastOrderDate: Date;
  role: string;
  isValidated: boolean;
  profile: Profile;
};

type UpdateUser = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  profilePicture?: string;
  birthDate: string;
  gender?: UserGender;
  role?: UserRole;
};

type UserAddressResponse = {
  adress: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  cityId: string;
  id: string;
  additionalInformation: string | null;
  referencePoint: string | null;
  nameCity: string;
  nameState: string;
  nameCountry: string;
};

type CreateUserAddressRequest = BaseModel & {
  adress: string;
  zipCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  cityId?: string;
  additionalInformation?: string | null;
  referencePoint?: string | null;
};

type State = {
  id: string;
  name: string;
};

type CityResponse = {
  id: string;
  name: string;
  state: StateResponse;
};

type OrderResponse = {
  type: OrderType;
  status: OrderStatus;
  totalPrice: number;
};

type Inventory = BaseModel & {
  stockQuantity: number;
  branch: BranchResponse;
  productPresentation: ProductPresentation;
};
