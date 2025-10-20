// components/Cart.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { readCart, writeCart, CartItem } from '../../lib/cartUtils'

export default function Cart() {
  const [items, setItems] = useState<CartItem[] | null>(null);


  useEffect(() => {
    setItems(readCart());
  }, []);


  const updateItems = (next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  };

  const onRemove = (id: string) => {
    updateItems((items ?? []).filter((i) => i.id !== id));
  };

  const onQtyChange = (id: string, qty: number) => {
    if (qty < 1) qty = 1;
    const next = (items ?? []).map((i) => (i.id === id ? { ...i, qty } : i));
    updateItems(next);
  };

  const onClear = () => {
    updateItems([]);
  };

  const subtotalINR = useMemo(() => {
    if (!items) return 0;
    return items.reduce((s, it) => s + it.price * it.qty, 0);
  }, [items]);


  if (items === null) {
    return (
      <main className="min-h-[40vh] flex items-center justify-center">
        <div>Loading cart…</div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-xl text-center bg-white rounded-md shadow p-8">
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-sm text-slate-600 mb-4">
            Browse products and add items you&apos;re interested in.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/" className="px-4 py-2 border rounded-md text-slate-700 hover:bg-slate-50">Back Home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      <div className="bg-white rounded-md shadow divide-y">
        {items.map((it) => (
          <div key={it.id} className="flex gap-4 p-4 items-center">
            <div className="relative flex-none w-20 h-20 bg-white border rounded-md overflow-hidden">
              {it.image ? (
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-contain"
                  sizes="80px"
                  priority={false}
                />
              ) : (
                <div className="text-xs text-slate-500 p-2">No image</div>
              )}
            </div>


            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">{it.title}</div>
                </div>

                <div className="text-sm font-semibold">₹{Math.round(it.price * it.qty)}</div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => onQtyChange(it.id, Math.max(1, it.qty - 1))}
                    className="px-3 py-1"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => {
                      const v = Number(e.target.value || 1);
                      onQtyChange(it.id, isFinite(v) ? Math.max(1, Math.trunc(v)) : 1);
                    }}
                    className="w-16 text-center border-l border-r px-2 py-1"
                  />
                  <button onClick={() => onQtyChange(it.id, it.qty + 1)} className="px-3 py-1" aria-label="Increase quantity">
                    +
                  </button>
                </div>

                <button onClick={() => onRemove(it.id)} className="text-sm text-rose-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <button onClick={onClear} className="px-4 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Clear cart</button>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-600">Subtotal</div>
          <div className="text-2xl font-bold">₹{subtotalINR}</div>
          <div className="mt-3">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700" onClick={() => alert('To Be Implemented')}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </main>
  );
}
