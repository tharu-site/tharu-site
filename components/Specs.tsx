export default function Specs() {
  const specs = [
  ["Case Diameter", "40mm"],
  ["Case Height", "11mm"],
  ["Lug-to-Lug", "47mm"],
  ["Crystal", "Mineral crystal"],
  ["Case Material", "Stainless steel"],
  ["Movement", "Quartz"],
  ["Water Resistance", "3ATM Resistance"],
  ["Strap Width", "20mm"],
  ["Strap Material", "Leather"],
  ["Colour Options", "Black / White"],
];

  return (
    <section className="border-t border-neutral-900 px-6 py-20 md:py-32">

      <div className="mx-auto grid max-w-7xl gap-20 md:grid-cols-2">

        <div>

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Technical Specifications
          </p>

          <h2 className="text-5xl font-light leading-tight md:text-6xl">
            Minimal in appearance. Precise in detail.
          </h2>

        </div>

        <div className="space-y-6">

          {specs.map(([label, value], i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-neutral-800 pb-5"
            >

              <p className="text-neutral-500">
                {label}
              </p>

              <p className="text-lg text-white">
                {value}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}