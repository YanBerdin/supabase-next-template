export default function TeamsPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nos Équipes</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Découvrez toutes les équipes du Réveil Basket Is sur Tille
          </p>
        </div>
      </div>
      {/* TODO: Ajouter la liste des équipes */}
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Équipe Senior Masculine</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Championnat départemental
              </p>
            </div>
          </div>
          {/* Autres équipes à ajouter */}
        </div>
      </div>
    </div>
  )
}
