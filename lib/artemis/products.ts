/**
 * @deprecated Site audit F-1: product module data now lives in
 * `data/products-editorial.ts` (editorial overlay over PRODUCT_REGISTRY.yaml).
 * This module only re-exports it so existing importers keep working; new code
 * should import from `@/data/products-editorial` instead. Remove once the
 * module pages and components have migrated.
 */
import {
  getProductEditorial,
  productsEditorial,
  type ProductEditorial,
  type ProductStatus,
} from "@/data/products-editorial";

export type { ProductStatus };
export type Product = ProductEditorial;

export const products: Product[] = productsEditorial;

export function getProduct(slug: string): Product | null {
  return getProductEditorial(slug);
}
