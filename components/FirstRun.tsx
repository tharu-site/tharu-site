export default function FirstRun() {
  return (
    <section className="border-t border-neutral-900 px-6 py-20 md:py-32">

      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">

        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            First Run
          </p>

          <h2 className="text-5xl font-light leading-tight md:text-6xl">
            Originis marks the beginning.
          </h2>
        </div>

        <div className="space-y-8 text-lg leading-relaxed text-neutral-400">

          <p>
            A refined expression of form and proportion —
designed to sit naturally, and remain relevant over time.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-6">

            <div>
              <p className="text-sm text-neutral-500">
                Batch
              </p>

              <p className="mt-3 text-3xl text-white">
                Limited to 120 pieces
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}