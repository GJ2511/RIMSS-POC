// lib/productUtils.ts
export const COLORS = ["Red", "Blue", "Green", "Black", "White", "Brown", "Yellow", "Gray"];

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  productId?: number;
  name?: string;
  images?: Array<string>;
}

export type EnrichedProduct = {
  id: string;
  title: string;
  price: number;
  description: string;
  category?: string;
  images: string[]; // at least one image
  color: string;
  discounted: boolean;
  image?: string; // convenience: first image
};

export function enrichProduct(input: Product): EnrichedProduct {
  const idNum = Number(input?.id ?? input?.productId ?? 0);
  const color = COLORS[idNum % COLORS.length];
  const discounted = idNum % 3 === 0; // demo rule — change as needed

  const images: string[] = [];
  if (Array.isArray(input?.images) && input.images.length > 0) {
    images.push(...input.images.map(String));
  } else if (input?.image) {
    images.push(String(input.image));
  }

  return {
    id: String(input.id),
    title: String(input.title ?? input.name ?? ""),
    price: Number(input.price ?? 0),
    description: input.description ?? "",
    category: input.category ?? "",
    images,
    image: images[0],
    color,
    discounted,
  };
}
