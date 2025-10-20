// app/products/[id]/page.tsx
import Link from "next/link";
import ProductGallery from "../../components/ProductGallery";
import AddToCart from "../../components/AddToCart";
import { enrichProduct } from "../../../lib/productUtils";
import type { Metadata } from "next";

type FetchedProduct = {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${params.id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("not found");
    const product = (await res.json()) as FetchedProduct;
    const prod = enrichProduct(product);
    return {
      title: `${prod.title} — RIMSS`,
      description: prod.description.slice(0, 150),
    };
  } catch {
    return { title: "Product — RIMSS" };
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // server fetch of single product; use FakeStore API and enrich locally
  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`, { next: { revalidate: 60 } });
  if (!res.ok) return <div className="p-8">Product not found</div>;

  const data = (await res.json()) as FetchedProduct;
  const product = enrichProduct(data);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 text-sm font-medium"
      >
        ← Back to Home
      </Link>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Gallery (client interactive) */}
        <div>
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Details */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <p className="text-sm text-slate-600 mb-4">{product.category}</p>

          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">₹{Math.round(product.price * 83)}</div>
            {product.discounted ? (
              <div className="text-sm text-white bg-rose-600 px-2 py-1 rounded">Discount</div>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-slate-700">{product.description}</p>

          <div className="mt-4 text-sm text-slate-600">
            <strong>Color:</strong> <span className="ml-2">{product.color}</span>
          </div>

          <div className="mt-6">
            <AddToCart product={{ id: product.id, title: product.title, price: product.price, image: product.images[0] }} />
          </div>
        </div>
      </div>
    </div>
  );
}
