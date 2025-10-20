// app/cart/page.tsx (server)
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const Cart = dynamic(() => import("../components/Cart"), { ssr: false });

export const metadata: Metadata = {
  title: "Cart — RIMSS",
  description: "Shopping cart",
};

export default function CartPage() {
  return <Cart />;
}
