"use client";

import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClientSide } from "@/utils/supabase/client-side";
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Utiliser une référence pour stocker l'heure de la dernière tentative
  const lastFetchRef = useRef<number>(0);

  // Fonction de récupération de l'utilisateur avec mise en cache
  const fetchUser = async (force = false) => {
    // Si pas de force et qu'une récupération a été faite il y a moins de 30 secondes, on ne fait rien
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 30000) {
      return;
    }
    
    // Mettre à jour le timestamp
    lastFetchRef.current = now;
    
    // Ajout d'un timeout pour éviter un blocage indéfini
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Délai d'attente dépassé")), 10000)
    );

    try {
      setLoading(true);
      const supabase = createClientSide();

      // Course entre la requête et le timeout
      const result = await Promise.race([
        supabase.auth.getUser(),
        timeoutPromise
      ]) as { data: { user: any } | null };

      // Si on arrive ici, c'est que la requête a réussi avant le timeout
      const currentUser = result?.data?.user || null;
      
      // Vérifier si l'état a réellement changé pour éviter des re-rendus inutiles
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        console.log("État utilisateur mis à jour:", currentUser ? "Connecté" : "Déconnecté");
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
      // On met explicitement l'utilisateur à null en cas d'erreur
      setUser(null);
    } finally {
      // On s'assure de sortir de l'état de chargement quoi qu'il arrive
      setLoading(false);
    }
  };

  // Effet pour la récupération initiale et la mise en place des écouteurs
  useEffect(() => {
    // Si les variables d'environnement sont disponibles
    if (hasEnvVars) {
      // Récupération initiale de l'utilisateur
      fetchUser(true);
      
      // Mettre en place un intervalle pour rafraîchir périodiquement l'état
      const refreshInterval = setInterval(() => {
        fetchUser();
      }, 60000); // Vérifier toutes les minutes
      
      // Surveillance des changements d'état d'authentification
      const supabase = createClientSide();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Forcer un rafraîchissement de la page pour s'assurer que tous les états sont réinitialisés
          window.location.reload();
        }
      });
      
      // Écouteur pour détecter quand l'utilisateur revient sur la page
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log("Page redevient visible, rafraîchissement de l'état utilisateur");
          fetchUser(true);
        }
      };
      
      // Ajouter l'écouteur de visibilité
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Ajouter un écouteur pour le focus de fenêtre
      window.addEventListener('focus', () => {
        console.log("Fenêtre a le focus, rafraîchissement de l'état utilisateur");
        fetchUser(true);
      });
      
      // Fonction de nettoyage
      return () => {
        clearInterval(refreshInterval);
        subscription.unsubscribe();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', () => fetchUser(true));
      };
    } else {
      // Sinon on sort immédiatement de l'état de chargement
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary/70" />
        <span className="text-sm text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-2">
        <Button
          asChild
          size="sm"
          variant={"ghost"}
          className="text-sm"
        >
          <Link href="/sign-in">Se connecter</Link>
        </Button>
        
        <Button asChild size="sm" variant={"default"} className="text-sm">
          <Link href="/sign-up">S'inscrire</Link>
        </Button>
      </div>
    );
  }

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Badge
          variant={"default"}
          className="font-normal pointer-events-none"
        >
          Veuillez mettre à jour le fichier .env.local avec la clé anon et l'URL
        </Badge>
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-in">Se connecter</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={"default"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-up">S'inscrire</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fonction pour gérer la déconnexion
  const handleSignOut = async () => {
    setLoading(true); // Indiquer que nous sommes en train de traiter la déconnexion
    try {
      const supabase = createClientSide();
      await supabase.auth.signOut();
      setUser(null);
      // Rafraîchir la page pour s'assurer que tous les composants sont mis à jour
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaire pour les clics sur les boutons de connexion et d'inscription
  const handleAuthButtonClick = () => {
    // Après un court délai, forcer une vérification de l'état d'authentification
    setTimeout(() => {
      fetchUser(true);
    }, 500);
  };
  
  return user ? (
    <div className="flex items-center gap-2">
      <span className="hidden md:inline text-sm text-muted-foreground">
        Bonjour, {user.email?.split('@')[0]}!
      </span>
      <Button 
        onClick={handleSignOut} 
        size="sm" 
        variant={"ghost"} 
        className="text-sm"
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'Déconnexion'}
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"ghost"} className="text-sm">
        <Link href="/sign-in" onClick={handleAuthButtonClick}>Se connecter</Link>
      </Button>
      <Button asChild size="sm" variant={"default"} className="text-sm">
        <Link href="/sign-up" onClick={handleAuthButtonClick}>S'inscrire</Link>
      </Button>
    </div>
  );
}
