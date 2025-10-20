// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { enrichProduct, Product  } from "../../lib/productUtils";

/**
 * Proxy for fakestoreapi.com with simple pagination, filtering, and synthetic fields:
 * Query params:
 *  - page (1-based)
 *  - pageSize
 *  - q (search text)
 *  - category
 *  - color
 *  - discounted (1 => only discounted)
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // fetch all products from fakestore
    const upstream = await fetch("https://fakestoreapi.com/products");
    if (!upstream.ok) {
      return res.status(502).json({ error: "Upstream fetch failed" });
    }
    const all: Product[] = await upstream.json();

    // add color & discounted into products as I don;t have it in response
    const products = all.map((p) => enrichProduct(p));

    // extract query params
    const {
      page = "1",
      pageSize = "12",
      q = "",
      category,
      color,
      discounted
    } = req.query;

    const pageNum = Math.max(1, parseInt(Array.isArray(page) ? page[0] : page));
    const size = Math.max(1, parseInt(Array.isArray(pageSize) ? pageSize[0] : pageSize));

    // filtering
    let filtered = products.slice();

    const qLower = String(q || "").trim().toLowerCase();
    if (qLower) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(qLower) || (p.description || "").toLowerCase().includes(qLower)
      );
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === String(category));
    }
    if (color) {
      filtered = filtered.filter((p) => p.color === String(color));
    }
    if (discounted === "1") {
      filtered = filtered.filter((p) => p.discounted === true);
    }

    const total = filtered.length;
    const start = (pageNum - 1) * size;
    const end = start + size;
    const pageItems = filtered.slice(start, end);

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.json({
      page: pageNum,
      pageSize: size,
      total,
      items: pageItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
