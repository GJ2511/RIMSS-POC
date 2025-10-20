// components/ProductCard.tsx
"use client";
import Image from "next/image";
import React from "react";
import AddToCart from "./AddToCart"; 

export type Product = {
  id: string;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  color?: string;
  discounted?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="bg-white rounded-md shadow-sm border overflow-hidden">
      <div className="w-full h-44 relative bg-white flex items-center justify-center">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            style={{ objectFit: "contain" }}
            className="object-contain"
            priority={false}
            loading="lazy"
          />
        ) : (
          <div className="text-sm text-slate-500">No image</div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
        <p className="text-xs text-slate-600">{product.category}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-md font-semibold">₹{Math.round(product.price * 83)}</div>
          {product.discounted ? (
            <div className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Discount</div>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{product.color}</span>
          <a href={`/product/${product.id}`} className="text-sky-600 hover:underline">View</a>
        </div>

        <div className="mt-3">
          <AddToCart product={{ id: product.id, title: product.title, price: product.price, image: product.image }} quantitySelector />
        </div>
      </div>
    </article>
  );
}
