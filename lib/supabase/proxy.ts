import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { sanitizeRedirectUrl } from "@/lib/security/redirect";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() validates the token against Supabase Auth servers
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isCallbackRoute = pathname.startsWith("/auth/callback");

  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/today") ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/calendar") ||
    pathname.startsWith("/habits") ||
    pathname.startsWith("/routine") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/focus") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/settings");

  // Allow auth callback to complete without interference
  if (isCallbackRoute) {
    return supabaseResponse;
  }

  // Unauthenticated user attempting to access protected route
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    if (pathname !== "/") {
      redirectUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Authenticated user attempting to visit login/signup
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    const rawTarget = request.nextUrl.searchParams.get("redirect");
    const redirectTarget = sanitizeRedirectUrl(rawTarget, "/today");
    redirectUrl.pathname = redirectTarget;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
