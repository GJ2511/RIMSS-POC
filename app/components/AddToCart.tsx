// components/AddToCart.tsx
"use client";
import React, { useEffect, useState } from "react";
import { readCart, writeCart } from '../../lib/cartUtils'

type ProductMeta = {
  id: string;
  title: string;
  price: number;
  image?: string;
};

export default function AddToCart({
  product,
  quantitySelector = false,
}: {
  product: ProductMeta;
  quantitySelector?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(false);
    setQty(1);
  }, [product.id]);

  const addToCart = (addQty = qty) => {
    if (!product?.id) return;
    const items = readCart();
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += addQty;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: addQty,
      });
    }
    writeCart(items);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (!quantitySelector) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => addToCart(1)}
          className="px-3 py-1 bg-sky-600 text-white rounded-md text-sm hover:bg-sky-700"
          aria-label={`Add ${product.title} to cart`}
        >
          Add
        </button>
        {added ? <span className="text-sm text-emerald-600">✓</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-lg"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          value={qty}
          onChange={(e) => {
            const v = Number(e.target.value || 1);
            setQty(Math.max(1, isFinite(v) ? v : 1));
          }}
          className="w-16 text-center border-l border-r px-2 py-2"
          min={1}
        />
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2 text-lg"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        id="addToCart"
        onClick={() => addToCart()}
        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
      >
        Add to cart
      </button>

      {added ? <span className="text-sm text-emerald-600">Added ✓</span> : null}
    </div>
  );
}
