/**
 * Fetch real tech product data from DummyJSON (no API key needed)
 * Run: npx tsx scripts/fetch-products.ts
 * Output: src/real-data.ts — review, then merge MOCK_PRODUCTS into src/data.ts
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE = 'https://dummyjson.com/products';

const CATEGORY_MAP: Record<string, string> = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  tablets: 'Laptops',
  'mobile-accessories': 'Accessories',
  'wireless-earphones': 'Audio',
  'smart-watches': 'Wearables',
};

const INBOX_MAP: Record<string, string[]> = {
  Smartphones: ['Device', 'USB-C Cable', 'SIM Ejector Tool', 'Quick Start Guide'],
  Laptops: ['Laptop', 'USB-C Power Adapter', 'Quick Start Guide'],
  Audio: ['Earphones/Headphones', 'Charging Cable', 'Ear Tips (S/M/L)', 'User Manual'],
  Wearables: ['Watch/Band', 'Magnetic Charging Cable', 'User Manual'],
  Accessories: ['Device', 'Charging Cable', 'User Manual'],
};

interface DJProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: { rating: number; comment: string; reviewerName: string }[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
}

function mapCategory(cat: string): string {
  return CATEGORY_MAP[cat] ?? 'Accessories';
}

function originalPrice(price: number, discount: number): number | undefined {
  if (discount <= 0) return undefined;
  return Math.round((price / (1 - discount / 100)) * 100) / 100;
}

function toFeatures(desc: string): string[] {
  const sentences = desc
    .split(/[.!]/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 120);
  return sentences.slice(0, 5);
}

function toSpecs(p: DJProduct): { key: string; value: string }[] {
  const specs: { key: string; value: string }[] = [];
  if (p.brand) specs.push({ key: 'Brand', value: p.brand });
  if (p.weight) specs.push({ key: 'Weight', value: `${p.weight}g` });
  if (p.dimensions) {
    const d = p.dimensions;
    specs.push({ key: 'Dimensions', value: `${d.width} × ${d.height} × ${d.depth} mm` });
  }
  if (p.warrantyInformation) specs.push({ key: 'Warranty', value: p.warrantyInformation });
  if (p.shippingInformation) specs.push({ key: 'Shipping', value: p.shippingInformation });
  if (p.returnPolicy) specs.push({ key: 'Return Policy', value: p.returnPolicy });
  return specs.slice(0, 5);
}

function toSku(p: DJProduct): string {
  const prefix = p.category.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase();
  return `GK-${prefix}-${String(p.id).padStart(4, '0')}`;
}

function mapProduct(p: DJProduct) {
  const category = mapCategory(p.category);
  const imgs = p.images.filter(Boolean);
  while (imgs.length < 5) imgs.push(p.thumbnail);

  const orig = originalPrice(p.price, p.discountPercentage);
  const reviewCount = p.reviews?.length
    ? p.reviews.length * Math.floor(Math.random() * 80 + 20)
    : Math.floor(p.rating * 200 + Math.random() * 300);

  return {
    id: String(p.id),
    name: p.title,
    brand: p.brand ?? 'Generic',
    category,
    price: p.price,
    ...(orig ? { originalPrice: orig } : {}),
    image: p.thumbnail,
    images: imgs.slice(0, 5),
    rating: Math.round(p.rating * 10) / 10,
    reviewCount,
    inStock: (p.availabilityStatus ?? 'In Stock') !== 'Out of Stock' && p.stock > 0,
    sku: toSku(p),
    shortFeatures: toFeatures(p.description),
    description: [p.description],
    specifications: toSpecs(p),
    inTheBox: INBOX_MAP[category] ?? ['Device', 'Cable', 'Manual'],
    isHotDeal: p.discountPercentage >= 10,
    isNewArrival: false, // set below per-category
  };
}

async function fetchAll(): Promise<DJProduct[]> {
  const res = await fetch(`${BASE}?limit=0`);
  const data = await res.json() as { total: number };
  const total = data.total;
  const res2 = await fetch(`${BASE}?limit=${total}&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags,weight,dimensions,warrantyInformation,shippingInformation,availabilityStatus,reviews,returnPolicy`);
  const data2 = await res2.json() as { products: DJProduct[] };
  return data2.products;
}

async function main() {
  console.error('Fetching all products from DummyJSON...');
  const all = await fetchAll();
  console.error(`Total products available: ${all.length}`);

  const techCategories = new Set(Object.keys(CATEGORY_MAP));
  const techProducts = all.filter(p => techCategories.has(p.category));
  console.error(`Tech products found: ${techProducts.length}`);

  if (techProducts.length === 0) {
    // fallback: take all and filter by likely tech categories
    console.error('No exact matches — using broader filter');
    const broader = all.filter(p =>
      /phone|laptop|tablet|watch|audio|ear|smart|tech|electronic|computer|accessory/i.test(p.category)
    );
    console.error(`Broader match: ${broader.length}`);
    techProducts.push(...broader);
  }

  const mapped = techProducts.map(mapProduct);

  // mark first 2 per category as new arrivals
  const seenCats: Record<string, number> = {};
  for (const p of mapped) {
    seenCats[p.category] = (seenCats[p.category] || 0) + 1;
    if (seenCats[p.category] <= 2) p.isNewArrival = true;
  }

  const outPath = join(__dirname, '..', 'src', 'real-data.ts');
  const content = `/**
 * Auto-generated by scripts/fetch-products.ts — ${new Date().toISOString()}
 * Source: dummyjson.com (no API key required)
 * ${mapped.length} products
 *
 * To use: replace MOCK_PRODUCTS in src/data.ts with this array
 */

import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(mapped, null, 2)};
`;

  writeFileSync(outPath, content, 'utf-8');
  console.error(`\nWrote ${mapped.length} products → src/real-data.ts`);
  console.error('Review it, then swap MOCK_PRODUCTS in src/data.ts');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
