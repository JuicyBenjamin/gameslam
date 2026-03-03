export const InfoHero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 lg:py-32">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            What is a Game Slam?
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 lg:text-2xl">
            A Game Slam is a fun way to practice game development, inspired by game jams but with a more relaxed
            approach. Instead of rushing to create a complete game, you'll focus on building specific game mechanics
            and learning as you go.
          </p>
        </div>
      </div>
    </section>
  )
}
