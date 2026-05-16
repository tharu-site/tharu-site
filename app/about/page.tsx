import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d0d0d] text-white">

      <Navbar />

      {/* HERO */}
      <section className="relative px-6 pt-32 pb-28 md:px-10 md:pt-40 md:pb-36">

        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">

          <Image
            src="/about/about-hero.jpg"
            alt="THARU"
            fill
            priority
            className="object-cover opacity-25"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/75" />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[#0d0d0d]" />

        </div>

        {/* CONTENT */}
        <div className="relative mx-auto max-w-6xl">

          <p className="mb-5 text-sm uppercase tracking-[0.45em] text-neutral-500">
            About THARU
          </p>

          <h1 className="max-w-5xl text-5xl font-light leading-[1.05] md:text-7xl">

            A quiet beginning.
            <br />
            Built with intention.

          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-neutral-300 md:text-xl">

            THARU exists in the space between
            restraint and presence —
            creating pieces designed to feel timeless,
            intentional, and quietly powerful.

          </p>

        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="px-6 pb-28 md:px-10 md:pb-36">

        <div className="mx-auto max-w-6xl">

          {/* FIRST BLOCK */}
          <div className="grid items-center gap-16 md:grid-cols-2">

            {/* TEXT */}
            <div className="space-y-8 text-lg leading-relaxed text-neutral-300">

              <p>

                THARU was created with a focus on restraint.
                In a space where most products compete for attention,
                we chose to step back — to refine, simplify,
                and focus on what remains.

              </p>

              <p>

                The goal was never to create more,
                but to create with intention.
                Clean design. Balanced proportions.
                A presence that doesn’t rely on excess.

              </p>

            </div>

            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-[32px] border border-neutral-800">

              <div className="relative h-[500px]">

                <Image
                  src="/about/editorial-1.jpg"
                  alt="THARU Editorial"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />

              </div>

            </div>

          </div>

          {/* SECOND BLOCK */}
          <div className="mt-32 grid items-center gap-16 md:grid-cols-2">

            {/* IMAGE */}
            <div className="relative order-2 overflow-hidden rounded-[32px] border border-neutral-800 md:order-1">

              <div className="relative h-[500px]">

                <Image
                  src="/about/editorial-2.jpg"
                  alt="THARU Craftsmanship"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />

              </div>

            </div>

            {/* TEXT */}
            <div className="order-1 border-l border-neutral-800 pl-6 text-lg leading-relaxed text-neutral-300 md:order-2 md:pl-10">

              <p>

                Originis marks the beginning.
                The first release, limited to 120 pieces.

              </p>

              <p className="mt-8">

                Each one individually numbered
                as part of this edition.

              </p>

              <p className="mt-8">

                Not designed to be everywhere,
                but to belong to a few.

              </p>

            </div>

          </div>

          {/* FINAL BLOCK */}
          <div className="mt-32">

            <div className="relative overflow-hidden rounded-[40px] border border-neutral-800">

              <div className="relative h-[550px]">

                <Image
                  src="/about/editorial-3.jpg"
                  alt="THARU Lifestyle"
                  fill
                  className="object-cover opacity-80"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/55" />

                {/* TEXT */}
                <div className="absolute inset-0 flex items-end p-10 md:p-16">

                  <div className="max-w-3xl">

                    <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">
                      THARU
                    </p>

                    <h2 className="mt-4 text-4xl font-light leading-tight md:text-6xl">

                      This is where THARU starts.
                      <br />
                      With clarity,
                      and without noise.

                    </h2>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}