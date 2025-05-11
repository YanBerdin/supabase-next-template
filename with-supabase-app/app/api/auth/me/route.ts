import { createClient } from "@/utils/supabase/server";
import { createClient as createClientBrowser } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  // On essaie d'abord avec le client côté serveur
  try {
    // Premier essai avec le client serveur
    const supabase = await createClient();
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data?.user;

    if (user) {
      return NextResponse.json({ data: { user } });
    }

    // Si le premier essai échoue ou ne renvoie pas d'utilisateur
    // On tente avec le client browser comme fallback
    const supabaseBrowser = createClientBrowser();
    const browserResponse = await supabaseBrowser.auth.getUser();
    const browserUser = browserResponse.data?.user;

    if (browserUser) {
      return NextResponse.json({ data: { user: browserUser } });
    }
    
    // Si aucun utilisateur n'est trouvé, on renvoie une réponse 401
    return NextResponse.json(
      { error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in auth/me route:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}
