// app/page.tsx
import dynamic from "next/dynamic";

const Products = dynamic(() => import("./components/Products"), { ssr: false });
export const metadata = {
  title: "RIMSS — Home",
  description: "Home — product listing and search",
};

export default function Home() {
  return (
    <Products />
  );
}
