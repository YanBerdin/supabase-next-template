'use server'

import { createClient } from '@/utils/supabase/server'

export type Event = {
  id: string
  title: string
  description: string
  location: string
  start_time: string
  end_time: string
  category: string
  team_id?: string
  created_at?: string
}

export type Team = {
  id: string
  name: string
  category: string
  coach: string
  championship: string
  schedule: string
  description: string
  image_url: string
  created_at?: string
}

export type News = {
  id: string
  title: string
  content: string
  summary: string
  image_url: string
  category: string
  published_at: string
  author_id?: string
  created_at?: string
}

// Fonction serveur pour récupérer les événements depuis Supabase
export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").select("*").order("start_time", { ascending: true })
  
  if (error) {
    console.error("Error fetching events:", error)
    return []
  }
  
  if (!data || data.length === 0) {
    return []
  }

  // Validation des données
  const validCategories = ["match", "training", "tournament", "meeting", "other"]
  const validEvents = data.filter(event => {
    // Vérifier les champs requis
    if (!event.id || !event.title || !event.description || !event.location || 
        !event.start_time || !event.end_time || !event.category) {
      console.error("Invalid event data:", event)
      return false
    }
    
    // Vérifier les dates
    const startTime = new Date(event.start_time)
    const endTime = new Date(event.end_time)
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.error("Invalid event date:", event)
      return false
    }
    
    // Vérifier l'ordre des dates
    if (startTime >= endTime) {
      console.error("Invalid event date range:", event)
      return false
    }
    
    // Vérifier la catégorie
    if (!validCategories.includes(event.category)) {
      console.error("Invalid event category:", event)
      return false
    }
    
    return true
  })

  return validEvents as Event[]
}

export async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  if (!data) {
    return null
  }

  // Validation des données
  const validCategories = ["match", "training", "tournament", "meeting", "other"]
  if (!data.id || !data.title || !data.description || !data.location || 
      !data.start_time || !data.end_time || !data.category) {
    console.error("Invalid event data:", data)
    return null
  }
  
  // Vérifier les dates
  const startTime = new Date(data.start_time)
  const endTime = new Date(data.end_time)
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    console.error("Invalid event date:", data)
    return null
  }
  
  // Vérifier l'ordre des dates
  if (startTime >= endTime) {
    console.error("Invalid event date range:", data)
    return null
  }
  
  // Vérifier la catégorie
  if (!validCategories.includes(data.category)) {
    console.error("Invalid event category:", data)
    return null
  }

  return data as Event
}
export async function createEvent(event: Event): Promise<Event | null> {  
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").insert([event]).select().single()

  if (error) {
    console.error("Error creating event:", error)
    return null
  }

  return data as Event
}
export async function updateEvent(event: Event): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").update(event).eq("id", event.id).select().single()

  if (error) {
    console.error("Error updating event:", error)
    return null
  }

  return data as Event
}
export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error("Error deleting event:", error)
    return false
  }

  return true
}

export async function getTeams(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching teams:", error)
    return []
  }

  return data as Team[]
}

export async function getTeam(id: string): Promise<Team | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching team:", error)
    return null
  }

  return data as Team
}

export async function createTeam(team: Team): Promise<Team | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").insert([team]).select().single()

  if (error) {
    console.error("Error creating team:", error)
    return null
  }

  return data as Team
}

export async function updateTeam(team: Team): Promise<Team | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").update(team).eq("id", team.id).select().single()

  if (error) {
    console.error("Error updating team:", error)
    return null
  }

  return data as Team
}
export async function deleteTeam(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.from("teams").delete().eq("id", id)

  if (error) {
    console.error("Error deleting team:", error)
    return false
  }

  return true
}

export async function getNews(): Promise<News[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    return []
  }

  return data as News[]
}

export async function getNewsById(id: string): Promise<News | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching news:", error)
    return null
  }

  return data as News
}

export async function createNews(news: News): Promise<News | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").insert([news]).select().single()

  if (error) {
    console.error("Error creating news:", error)
    return null
  }

  return data as News
}

export async function updateNews(news: News): Promise<News | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").update(news).eq("id", news.id).select().single()

  if (error) {
    console.error("Error updating news:", error)
    return null
  }

  return data as News
}

export async function deleteNews(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) {
    console.error("Error deleting news:", error)
    return false
  }

  return true
}

export async function getNewsByCategory(category: string): Promise<News[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").select("*").eq("category", category).order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching news by category:", error)
    return []
  }

  return data as News[]
}