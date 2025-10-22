// tests/AddToCart.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, expect } from "vitest";
import AddToCart from "../app/components/AddToCart";

const TEST_CART_KEY = "rimss_demo_cart";

beforeEach(() => {
  localStorage.clear();
});

describe("AddToCart (quantitySelector)", () => {
  it("adds item to localStorage when quantitySelector Add clicked", async () => {
    const user = userEvent.setup();
    const product = { id: "p1", title: "Product 1", price: 10 };

    render(<AddToCart product={product} quantitySelector />);

    const addToCartBtn = screen.getByRole("button", { name: /add/i });
    await user.click(addToCartBtn);

    const cartData = localStorage.getItem(TEST_CART_KEY);
    console.log(cartData)
    expect(cartData).not.toBeNull();
    const items = JSON.parse(cartData as string);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("p1");
    expect(items[0].qty).toBe(1);
  });
});
