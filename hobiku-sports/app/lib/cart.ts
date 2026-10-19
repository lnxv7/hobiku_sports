import type { Product } from "./products";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  icon: string;
  quantity: number;
};

const CART_KEY = "hobiku-cart-items";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addProductToCart(
  product: Product,
  quantity = 1
): CartItem[] {
  const items = getCart();
  const existing = items.find(
    (item) => item.productId === product.id
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      quantity,
    });
  }

  saveCart(items);
  return items;
}
