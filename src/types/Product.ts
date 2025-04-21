export type Product = {
  id: string;
  productId: string; // productId
  imageUrl: string;
  name: string;
  category: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  quantity: number;
  getQuantity: (quantity: number) => void;
};
