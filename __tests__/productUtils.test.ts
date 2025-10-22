// __tests__/productUtils.test.ts
import { describe, it, expect } from "vitest";
import { enrichProduct, COLORS } from "../lib/productUtils";

const product = {
  id: 3,
  title: "Test Item",
  price: 10,
  description: "desc",
  category: "cat",
  image: "https://example.com/img.jpg",
  rating: {
    rate: 1,
    count: 1,
  },
};

describe("enrichProduct", () => {
  it("enriches a basic fakestore product", () => {
    const res = enrichProduct(product);
    expect(res.id).toBe(String(product.id));
    expect(res.title).toBe(product.title);
    expect(Array.isArray(res.images)).toBe(true);
    expect(res.image).toBe(res.images[0]);
    expect(res.color).toBe(COLORS[Number(product.id) % COLORS.length]);
    expect(res.discounted).toBe(true);
  });

  it("creates a fallback image when no images supplied", () => {
    const res = enrichProduct(product);
    expect(res.images.length).toBeGreaterThan(0);
    expect(res.image).toBe(res.images[0]);
  });
});
