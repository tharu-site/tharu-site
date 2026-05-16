import Image from "next/image";

export default function BrandSection() {
  return (
    <section className="relative py-20 md:py-32">

      {/* FULL WIDTH IMAGE */}
      <div className="relative h-[800px] w-full overflow-hidden">

        <Image
          src="/pic33.jpg"
          alt="THARU Lifestyle"
          fill
          className="object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* TEXT OVER IMAGE */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">

          <div className="max-w-3xl">

            <p className="mb-6 text-sm uppercase tracking-[0.4em] text-neutral-300">
              THARU Identity
            </p>

            <h2 className="text-5xl font-light leading-tight md:text-7xl">
              Designed to feel timeless.
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-300">
              Every detail is created to balance simplicity,
              elegance, and presence.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}