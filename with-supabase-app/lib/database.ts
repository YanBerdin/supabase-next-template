import { createClient } from '@/utils/supabase/server'
//import { SupabaseClient } from '@supabase/supabase-js'

// Type pour le profil utilisateur
export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  role: "admin" | "member" | "coach"
  created_at: string
}

// Fonction pour vérifier la connexion à Supabase
async function checkSupabaseConnection() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('_realtime').select('*').limit(1)
    
    // Si cette requête échoue pour des raisons autres que "relation does not exist",
    // alors c'est un problème de connexion général
    if (
      error &&
      !error.message.includes("relation") &&
      !error.message.includes("does not exist")
    ) {
      return false
    }
    
    return true
  } catch (error) {
    console.error("Erreur lors de la vérification de la connexion:", error)
    return false
  }
}

// Fonction pour récupérer le profil d'un utilisateur
export async function getUserProfile(userId: string) {
  try {
    // Vérifier d'abord si la connexion à Supabase fonctionne
    const isConnected = await checkSupabaseConnection()
    if (!isConnected) {
      console.error("Impossible de se connecter à Supabase")
      // Retourner un profil par défaut en cas d'échec de connexion
      return {
        id: userId,
        first_name: null,
        last_name: null,
        role: "member",
        created_at: new Date().toISOString(),
      } as Profile
    }

    const supabase = await createClient()
    // Dans votre structure, l'id du profil est le même que l'id de l'utilisateur
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error)
      // Retourner un profil par défaut en cas d'erreur
      return {
        id: userId,
        first_name: null,
        last_name: null,
        role: "member",
        created_at: new Date().toISOString(),
      } as Profile
    }

    return data as Profile
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    // Retourner un profil par défaut en cas d'exception
    return {
      id: userId,
      first_name: null,
      last_name: null,
      role: "member",
      created_at: new Date().toISOString(),
    } as Profile
  }
}

// Fonction pour mettre à jour le profil d'un utilisateur
export async function updateUserProfile(userId: string, profileData: Partial<Profile>) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").update(profileData).eq("id", userId).select().single()

    if (error) {
      console.error(`Error updating profile for user ${userId}:`, error)
      throw error
    }

    return data as Profile
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    throw error
  }
}

// Fonction pour inspecter la structure de la table profiles
export async function inspectProfilesTable() {
  try {
    const supabase = await createClient()
    // Récupérer un échantillon de la table profiles
    const { data, error } = await supabase.from("profiles").select("*").limit(5)
    console.log("Data fetched:", data, error)
    
    if (error) {
      console.error("Error fetching profiles sample:", error)
      throw error
    }

    // Si nous avons des données, extraire la structure
    if (data && data.length > 0) {
      const sampleProfile = data[0]
      const columns = Object.keys(sampleProfile)

      return {
        columns,
        sampleProfile,
        count: data.length,
        allProfiles: data,
      }
    }

    return {
      message: "No profiles found",
      data: [],
    }
  } catch (error) {
    console.error("Error inspecting profiles table:", error)
    throw error
  }
}
