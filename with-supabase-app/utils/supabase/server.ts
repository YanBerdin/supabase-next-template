import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()
  
  // Utiliser la nouvelle syntaxe recommandée qui résout l'avertissement de dépréciation
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        }, 
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignorer les erreurs quand on essaie de définir des cookies dans un composant serveur
            // Ces erreurs sont attendues et peuvent être ignorées en toute sécurité
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            // Ignorer les erreurs
          }
        }
      }
    }
  )

  // Retourner le client Supabase
  return supabase
}
