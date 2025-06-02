import { createClient } from '@/utils/supabase/server'
//import { SupabaseClient } from '@supabase/supabase-js'

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  role: "admin" | "member" | "coach"
  created_at: string
}

async function checkSupabaseConnection() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('_realtime').select('*').limit(1)
    
    // If Request fails for any other reason than "relation does not exist", it indicates a connection issue.
    // If the error message contains "relation does not exist", it means the table is not present, which is expected if the database is empty or not initialized.
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

export async function getUserProfile(userId: string) {
  try {
    // Check if we can connect to Supabase before proceeding
    const isConnected = await checkSupabaseConnection()
    if (!isConnected) {
      console.error("Impossible de se connecter à Supabase")
      // Return a default profile to avoid blocking the interface
      return {
        id: userId,
        first_name: null,
        last_name: null,
        role: "member",
        created_at: new Date().toISOString(),
      } as Profile
    }

    const supabase = await createClient()
    // Profile ID is the same as the user ID in this case
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error)
      // Return a default profile to avoid blocking the interface
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
    // Return a default profile to avoid blocking the interface
    return {
      id: userId,
      first_name: null,
      last_name: null,
      role: "member",
      created_at: new Date().toISOString(),
    } as Profile
  }
}

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

export async function inspectProfilesTable() {
  try {
    const supabase = await createClient()
    // Get a sample of profiles to inspect the structure
    const { data, error } = await supabase.from("profiles").select("*").limit(5)
    console.log("Data fetched:", data, error)
    
    if (error) {
      console.error("Error fetching profiles sample:", error)
      throw error
    }

    // If data is not empty, extract columns and a sample profile
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
