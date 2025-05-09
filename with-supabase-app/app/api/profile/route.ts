import { getUserProfile } from "@/lib/database";
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

    const profile = await getUserProfile(userId);
    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("Error in profile API route:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}
