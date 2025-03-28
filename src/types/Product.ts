export type Product = {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  quantity: number;
  getQuantity: (quantity: number) => void;
};
