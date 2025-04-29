import { BaseModel } from '@pharmatech/sdk';

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

type OrderResponse = BaseModel & {
  type: OrderType;
  status: OrderStatus;
  totalPrice: number;
};

type Inventory = BaseModel & {
  stockQuantity: number;
  branch: BranchResponse;
  productPresentation: ProductPresentation;
};

export type Branch = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type CreateBranchRequest = Branch & {
  cityId: string;
};

export type BranchResponse = Branch &
  BaseModel & {
    city: CityResponse;
  };

export type Coupon = {
  code: string;
  discount: number;
  minPurchase: number;
  maxUses: number;
  expirationDate: Date;
};

export type CouponResponse = Coupon & BaseModel;

export enum OrderType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export enum OrderStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface CreateOrderDetail {
  productPresentationId: string;
  quantity: number;
}

export interface CreateOrder {
  type: OrderType;
  branchId?: string;
  userAddressId?: string;
  products: {
    productPresentationId: string;
    quantity: number;
  }[];
}

export enum PaymentMethod {
  CARD = 'card',
  MOBILE_PAYMENT = 'mobile_payment',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export interface PaymentConfirmation {
  bank: string;
  reference: string;
  documentId: string;
  phoneNumber: string;
}

export interface PaymentConfirmationResponse extends BaseModel {
  bank: string;
  reference: string;
  documentId: string;
  phoneNumber: string;
}

export interface PaymentInformation {
  bank: string;
  accountType: string;
  account: string;
  documentId: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentInfoResponse extends BaseModel {
  bank: string;
  accountType: string;
  account: string;
  documentId: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
}
