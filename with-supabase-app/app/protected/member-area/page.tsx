
"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileText } from "lucide-react"
import { getUserProfile, type Profile } from "@/lib/database"

export default function MemberAreaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const isMounted = useRef(true)

  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Pour éviter les erreurs TypeScript avec les valeurs potentiellement nulles
  const displayName = userProfile?.first_name || user?.email?.split("@")[0] || "Membre"


  // Effet pour gérer le montage/démontage du composant
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Effet pour récupérer l'utilisateur actuel
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer l'utilisateur actuel via l'API
        const response = await fetch('/api/auth/me')
        const { data: { user: currentUser } } = await response.json()

        if (!currentUser) {
          router.push('/sign-in')
          return
        }

        if (isMounted.current) {
          setUser(currentUser)
        }

        // Récupérer le profil de l'utilisateur avec son ID
        // Comme getUserProfile attend un ID, nous l'appelons avec l'ID de l'utilisateur courant
        const profile = await fetch(`/api/profile?userId=${currentUser.id}`).then(res => res.json())
        
        if (isMounted.current && profile) {
          setUserProfile(profile.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos informations",
          variant: "destructive"
        })
      } finally {
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    fetchUserData()
  }, [router, toast])



  // Afficher un état de chargement pendant la vérification de l'authentification

  return (
    <>
    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    ) : (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-4xl font-bold">Bienvenue, {displayName}</h2>


        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="profile">Mon profil</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Prochains événements</CardTitle>
                  <CardDescription>Événements à venir pour votre équipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aucun événement à venir</p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Voir le calendrier complet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Dernières actualités</CardTitle>
                  <CardDescription>Restez informé des dernières nouvelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aucune actualité récente</p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Voir toutes les actualités
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Documents importants</CardTitle>
                  <CardDescription>Accédez rapidement aux documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Button variant="link" className="p-0 h-auto">
                        Règlement intérieur
                      </Button>
                    </li>
                    <li>
                      <Button variant="link" className="p-0 h-auto">
                        Calendrier des matchs
                      </Button>
                    </li>
                    <li>
                      <Button variant="link" className="p-0 h-auto">
                        Formulaire de remboursement
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Messages de l&apos;équipe</CardTitle>
                  <CardDescription>Communications internes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aucun message récent</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Mon profil</CardTitle>
                <CardDescription>Gérez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Informations personnelles</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Nom</div>
                        <div className="col-span-2">{userProfile?.last_name || "Non renseigné"}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Prénom</div>
                        <div className="col-span-2">{userProfile?.first_name || "Non renseigné"}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Email</div>
                        <div className="col-span-2">{user?.email || "Non renseigné"}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Rôle</div>
                        <div className="col-span-2">
                          {userProfile?.role === "admin"
                            ? "Administrateur"
                            : userProfile?.role === "coach"
                              ? "Entraîneur"
                              : "Membre"}
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4">Modifier mes informations</Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Équipe</h3>
                    <p className="text-muted-foreground">Vous n&apos;êtes pas encore assigné à une équipe.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Changer de mot de passe</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pour des raisons de sécurité, choisissez un mot de passe fort que vous n&apos;utilisez pas ailleurs.
                  </p>
                  <Button variant="outline">Changer mon mot de passe</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Accédez aux documents du club</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Documents administratifs</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Règlement intérieur
                        </Button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Statuts de l&apos;association
                        </Button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Charte du club
                        </Button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Documents sportifs</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Calendrier des matchs
                        </Button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Planning des entraînements
                        </Button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Formulaires</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Formulaire de remboursement
                        </Button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Autorisation parentale
                        </Button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Certificat médical
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
                <CardDescription>Gérez vos préférences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configurez les notifications que vous souhaitez recevoir.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-notif" className="text-sm font-medium">
                        Notifications par email
                      </label>
                      <input type="checkbox" id="email-notif" className="h-4 w-4" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="news-notif" className="text-sm font-medium">
                        Actualités du club
                      </label>
                      <input type="checkbox" id="news-notif" className="h-4 w-4" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="event-notif" className="text-sm font-medium">
                        Événements à venir
                      </label>
                      <input type="checkbox" id="event-notif" className="h-4 w-4" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Confidentialité</h3>
                  <p className="text-sm text-muted-foreground mb-4">Gérez vos paramètres de confidentialité.</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="profile-visibility" className="text-sm font-medium">
                        Visibilité du profil
                      </label>
                      <select id="profile-visibility" className="text-sm border rounded p-1">
                        <option value="members">Membres du club</option>
                        <option value="team">Mon équipe uniquement</option>
                        <option value="private">Privé</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Compte</h3>
                  <Button variant="destructive">Supprimer mon compte</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    )}
    </>
  )
}


