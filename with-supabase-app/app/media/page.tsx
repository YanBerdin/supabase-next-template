export default function MediaPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Galerie Média</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Photos, vidéos et temps forts du Réveil Basket
          </p>
        </div>
      </div>

      {/* Section Albums Photos */}
      <div className="container px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Albums Photos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="aspect-video overflow-hidden">
              <img 
                src="/placeholder.jpg" 
                alt="Tournoi 2025"
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold">Tournoi de Printemps 2025</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">23 photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Vidéos */}
      <div className="container px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Vidéos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
              {/* Placeholder pour la vidéo */}
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Aperçu vidéo
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold">Résumé des matchs - Mai 2025</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Durée : 3:45
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Documents */}
      <div className="container px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Documents</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center rounded-lg border bg-card p-4">
            <div className="mr-4">
              <svg
                className="h-8 w-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Guide du club 2025</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">PDF - 2.3 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
