import { Product } from "../../types";

export type Props = {
  product: Product;
  onPurchase: (product: Product) => void;
}