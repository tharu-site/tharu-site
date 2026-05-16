export default function Features() {
  const features = [
    {
      title: "Steel Case",
      desc: "Durable and minimal construction.",
    },
    {
      title: "3ATM Resistance",
      desc: "Built for everyday reliability.",
    },
    {
      title: "Leather Strap",
      desc: "Comfortable fit with modern styling.",
    },
    {
      title: "40mm Profile",
      desc: "Balanced proportions for versatile wear.",
    },
  ];

  return (
    <section className="border-t border-neutral-900 px-6 py-20 md:py-32">

      <div className="mx-auto max-w-7xl">

        <div className="mb-20">

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Features
          </p>

          <h2 className="text-4xl md:text-6xl font-light md:text-5xl md:text-7xl">
            Built for everyday simplicity.
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-4">

          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-[32px] border border-neutral-800 bg-neutral-950 p-10 transition hover:-translate-y-2 hover:border-white"
            >

              <h3 className="text-2xl text-white">
                {feature.title}
              </h3>

              <p className="mt-5 leading-relaxed text-neutral-400">
                {feature.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}