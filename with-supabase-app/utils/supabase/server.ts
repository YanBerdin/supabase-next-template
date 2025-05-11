import { type CookieOptions, createServerClient } from '@supabase/ssr'

export const createClient = async () => {
  try {
    // Import dynamique de cookies
    const { cookies } = await import('next/headers')
    
    // Récupération synchrone des cookies
    const cookieStore = cookies()
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              const cookie = cookieStore.get(name)
              return cookie?.value
            } catch (error) {
              console.error(`Erreur lors de la récupération du cookie ${name}:`, error)
              return undefined
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Le set() a été appelé depuis un composant serveur - cela peut 
              // être ignoré si vous avez un middleware qui rafraichit les sessions
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookies().set({ name, value: '', ...options })
            } catch (error) {
              // Le remove() a été appelé depuis un composant serveur - cela peut 
              // être ignoré si vous avez un middleware qui rafraichit les sessions
            }
          }
        }
      }
    )
  } catch (e) {
    // Fallback avec des fonctions vides pour les tests et autres environnements
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: () => undefined,
          set: () => {},
          remove: () => {}
        }
      }
    )
  }
}
