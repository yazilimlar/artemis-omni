import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Signs the user out (POST only; Next.js answers other methods with 405).
 * 303 See Other turns the POST into a GET of "/" after the redirect.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Missing configuration: there is no session to clear; still leave the page.
  }
  return NextResponse.redirect(new URL("/", request.nextUrl.origin), { status: 303 });
}
