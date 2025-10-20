// components/ProductGallery.tsx
"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title?: string }) {
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <div className="w-full h-[420px] bg-white rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
        <Image
          src={images[idx]}
          alt={title || "product image"}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 1024px) 80vw, 50vw"
          priority={idx === 0}
        />
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-20 h-20 rounded-md overflow-hidden border ${i === idx ? "ring-2 ring-sky-500" : "border-slate-200"}`}
            aria-label={`Show image ${i + 1}`}
          >
            <div className="relative w-full h-full">
              <Image src={src} alt={`${title} ${i + 1}`} fill style={{ objectFit: "cover" }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
