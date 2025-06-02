import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isValidRedirectUrl } from "@/utils/validation";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Check if the request includes a redirect parameter
    const redirectParam = request.nextUrl.searchParams.get("redirect_to");
    if (redirectParam && !isValidRedirectUrl(redirectParam)) {
      // Si une redirection non autorisée est demandée, on redirige vers la page d'accueil
      return NextResponse.redirect(new URL("/", request.url));
    }

    // protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      const signInUrl = new URL("/sign-in", request.url);
      // Préserver la redirection d'origine si elle est sûre
      if (redirectParam && isValidRedirectUrl(redirectParam)) {
        signInUrl.searchParams.set("redirect_to", redirectParam);
      }
      return NextResponse.redirect(signInUrl);
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
