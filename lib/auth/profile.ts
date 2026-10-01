import type { RegistryProduct } from "@/lib/registry/load";
import { createClient } from "@/lib/supabase/server";

/** Roles from public.user_profiles (ADR-012). Only the owner assigns them. */
export type UserRole = "owner" | "admin" | "client" | "viewer";

export type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
};

const ROLES: readonly UserRole[] = ["owner", "admin", "client", "viewer"];

/** Visibility classes every signed-in role may see on the dashboard. */
const BASELINE_VISIBILITY = new Set(["public", "public_safe_demo"]);

/**
 * Reads the user's own profile through RLS. Fails soft: any error, a missing
 * row, or an unknown role returns null so the dashboard can show its fallback.
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, email, role, display_name, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data || !ROLES.includes(data.role as UserRole)) return null;
    return data as UserProfile;
  } catch {
    return null;
  }
}

export function isOwner(profile: UserProfile | null): boolean {
  return profile?.role === "owner";
}

export function canSeeAllProducts(profile: UserProfile | null): boolean {
  return profile?.role === "owner" || profile?.role === "admin";
}

/** Owner and admin see every product; everyone else sees public and public_safe_demo only. */
export function filterVisibleProducts(
  products: RegistryProduct[],
  profile: UserProfile | null,
): RegistryProduct[] {
  if (canSeeAllProducts(profile)) return products;
  return products.filter((product) => BASELINE_VISIBILITY.has(product.visibility));
}
