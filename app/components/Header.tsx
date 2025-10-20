// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Cart", href: "/cart" },
  ];

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-bold text-sky-600">
          RIMSS
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href
                  ? "text-sky-600 border-b-2 border-sky-600 pb-1"
                  : "text-slate-600 hover:text-sky-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  );
}
