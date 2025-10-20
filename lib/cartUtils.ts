export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

const CART_KEY = "rimss_demo_cart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    console.error('error while setting item to cart')
  }
}

export { readCart, writeCart };