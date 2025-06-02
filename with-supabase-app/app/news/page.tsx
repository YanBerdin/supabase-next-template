export default function NewsPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Actualités & Événements</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Restez informé des dernières nouvelles et événements du club
          </p>
        </div>
      </div>
      {/* TODO: Ajouter la liste des actualités */}
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <time className="text-sm text-gray-500 dark:text-gray-400">2 Juin 2025</time>
              <h3 className="mt-2 text-2xl font-bold">Reprise des entraînements</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Les entraînements reprennent à partir du lundi prochain...
              </p>
            </div>
          </article>
          {/* Autres actualités à ajouter */}
        </div>
      </div>
    </div>
  )
}
