// components/Products.tsx
"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductCard, { Product } from "./ProductCard";
import {COLORS} from '../../lib/productUtils'

type ApiResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: Product[];
};

const DEFAULT_PAGE_SIZE = 10;

const responseCache = new Map<string, ApiResponse>();

function cacheKey<T extends Record<string, unknown>>(params: T): string {
  return JSON.stringify(params);
}

export default function Products() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [discounted, setDiscounted] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const params = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      q,
      category,
      color,
      discounted: discounted ? "1" : undefined
    }),
    [page, q, category, color, discounted]
  );

  const loadPage = useCallback(
    async (pageToLoad: number, replace = false) => {
      setLoading(true);
      const p = {
        ...params,
        page: pageToLoad,
      };
      const key = cacheKey(p);
      if (responseCache.has(key)) {
        const cached = responseCache.get(key)!;
        setTotal(cached.total);
        setHasMore((pageToLoad * p.pageSize) < cached.total);
        setItems((prev) => (replace ? cached.items : [...prev, ...cached.items]));
        setLoading(false);
        return;
      }
      try {
        const searchParams = new URLSearchParams();
        Object.entries(p).forEach(([k, v]) => {
          if (v !== undefined && v !== "") searchParams.set(k, String(v));
        });
        const url = `/api/products?${searchParams.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");
        const data: ApiResponse = await res.json();
        responseCache.set(key, data);
        setTotal(data.total);
        setHasMore((pageToLoad * (data.pageSize || DEFAULT_PAGE_SIZE)) < data.total);
        setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // initial + filter change effect: reset page to 1 and replace items
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, color, discounted]);

  // page increment effect: load when page changes (except page 1 handled above)
  useEffect(() => {
    if (page === 1) return;
    loadPage(page, false);
  }, [page, loadPage]);

  // infinite scroll observer
  useEffect(() => {
    if (!bottomRef.current) return;
    const el = bottomRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && hasMore) {
            setPage((p) => p + 1);
          }
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  // Clear filters
  const clearFilters = () => {
    setQ("");
    setCategory("");
    setColor("");
    setDiscounted(false);
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-md p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or description..."
            className="flex-1 border rounded-md px-3 py-2 mb-2 sm:mb-0"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-md px-3 py-2">
            <option value="">All categories</option>
            <option value="men's clothing">men&apos;s clothing</option>
            <option value="women's clothing">women&apos;s clothing</option>
            <option value="jewelery">jewelery</option>
            <option value="electronics">electronics</option>
          </select>
          <select value={color} onChange={(e) => setColor(e.target.value)} className="border rounded-md px-3 py-2">
            <option value="">All colors</option>
            {COLORS.map(c => <option key={c}>{c}</option>)}
          </select>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={discounted} onChange={(e) => setDiscounted(e.target.checked)} />
            <span className="text-sm">Discounted</span>
          </label>

          <button onClick={clearFilters} className="ml-auto px-3 py-2 border rounded-md text-sm">
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <ProductCard key={it.id} product={it} />
        ))}
      </div>

      <div ref={bottomRef} style={{ height: 1 }} />

      <div className="mt-6 text-center">
        {loading ? <span>Loading...</span> : !hasMore ? <span></span> : <span>Scroll to load more</span>}
      </div>
    </div>
  );
}
