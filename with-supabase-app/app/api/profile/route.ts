import { getUserProfile } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    // Essayer d'abord avec getUserProfile
    try {
      const profile = await getUserProfile(userId);
      return NextResponse.json({ data: profile });
    } catch (primaryError) {
      console.warn("Erreur avec getUserProfile, tentative de fallback:", primaryError);
      
      // Fallback: essayer avec le client Supabase directement
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({ data });
      } catch (fallbackError) {
        console.error("Le fallback a également échoué:", fallbackError);
        
        // Si tout échoue, renvoyer un profil minimal pour éviter de bloquer l'interface
        return NextResponse.json({
          data: {
            id: userId,
            first_name: null,
            last_name: null,
            role: "member",
            created_at: new Date().toISOString()
          }
        });
      }
    }
  } catch (error) {
    console.error("Error in profile API route:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}
