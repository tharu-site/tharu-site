import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { products } from "@/components/products";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      {/* PRODUCTS */}
      <section className="px-4 pt-28 pb-20 md:px-6 md:pt-32 md:pb-24">

        <div className="mx-auto max-w-5xl">

          {/* PREORDER NOTICE */}
          <div className="mb-10 flex justify-center">

            <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-950 px-5 py-3">

              <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-300 md:text-xs">
                Pre-order — ships upon arrival. Expected delivery late June 2026.
              </p>

            </div>

          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">

            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group"
              >

                <div className="overflow-hidden rounded-[24px] border border-neutral-800 bg-neutral-950 p-3 transition hover:border-neutral-600 md:rounded-[28px] md:p-4">

                  {/* IMAGE */}
                  <div className="relative h-[180px] overflow-hidden rounded-[18px] bg-black md:h-[420px] md:rounded-[20px]">

                    <Image
                      src={product.variants.black}
                      alt={product.name}
                      fill
                      className="object-contain transition duration-500 group-hover:scale-[1.02]"
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="pt-4 md:pt-5">

                    <h2 className="text-sm font-light leading-snug md:text-2xl">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-[11px] leading-relaxed text-neutral-400 md:text-sm">
                      {product.shortDescription}
                    </p>

                    {/* PRICE */}
                    <div className="mt-3 flex items-center gap-3">

                      <p className="text-sm text-white md:text-base">
                        {product.basePrice}
                      </p>

                      <p className="text-[11px] text-neutral-500 line-through md:text-sm">
                        {product.originalPrice}
                      </p>

                    </div>

                    <button className="mt-4 rounded-full border border-neutral-700 px-4 py-1.5 text-[10px] uppercase tracking-wide transition hover:border-white md:mt-5 md:px-5 md:py-2 md:text-sm">

                      View Product

                    </button>

                  </div>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* EDITORIAL SECTION */}
      <section className="border-t border-neutral-900 px-6 py-24 md:px-10 md:py-32">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-24 max-w-4xl">

            <p className="mb-5 text-sm uppercase tracking-[0.4em] text-neutral-500">
              Crafted With Restraint
            </p>

            <h2 className="text-5xl font-light leading-tight md:text-7xl">
              Designed with clarity,
              precision, and quiet presence.
            </h2>

          </div>

          <div className="space-y-32">

            {/* THE CASE */}
            <div className="grid gap-12 border-b border-neutral-900 pb-20 md:grid-cols-2">

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  The Case
                </p>

              </div>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-300">

                <p>
                  THARU features a clean, restrained case design shaped with sharp
                  lines, balanced proportions, and subtle detailing throughout.
                </p>

                <p>
                  Multiple finishing processes are used during production to achieve
                  the crisp edges, smooth transitions, and refined surfaces that
                  define the watch’s profile.
                </p>

                <p>
                  A brushed finish gives the case a modern, understated character,
                  while polished details along the bezel catch light subtly, adding
                  depth without excess.
                </p>

              </div>

            </div>

            {/* THE DIAL */}
            <div className="grid gap-12 border-b border-neutral-900 pb-20 md:grid-cols-2">

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  The Dial
                </p>

              </div>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-300">

                <p>
                  The dial is designed with a focus on balance, depth, and restraint.
                  Applied markers and clean spacing create a layout that remains
                  highly legible while maintaining a minimal appearance.
                </p>

                <p>
                  Subtle contrasts across the dial surface add dimension under
                  changing light, while the hands are finished for clear visibility
                  throughout the day.
                </p>

                <p>
                  Surrounding the dial is a refined chapter ring featuring minute
                  markings that add structure and precision to the overall design
                  without overwhelming the watch’s clean profile.
                </p>

              </div>

            </div>

            {/* THE STRAP */}
            <div className="grid gap-12 border-b border-neutral-900 pb-20 md:grid-cols-2">

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  The Strap
                </p>

              </div>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-300">

                <p>
                  The THARU strap is designed to complement the watch with the same
                  level of restraint and simplicity carried throughout the case and
                  dial.
                </p>

                <p>
                  Crafted from genuine leather, the strap offers a clean profile,
                  soft feel, and comfortable fit for everyday wear.
                </p>

                <p>
                  Available in both black and brown finishes, each option brings a
                  distinct character while maintaining the watch’s understated
                  aesthetic.
                </p>

                <p>
                  Designed for versatility, the strap transitions naturally between
                  casual and formal settings, reinforcing THARU’s focus on modern,
                  everyday wear.
                </p>

              </div>

            </div>

            {/* THE CASEBACK */}
            <div className="grid gap-12 border-b border-neutral-900 pb-20 md:grid-cols-2">

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  The Caseback
                </p>

              </div>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-300">

                <p>
                  The caseback continues THARU’s restrained design approach with a
                  clean, minimal layout and carefully placed detailing.
                </p>

                <p>
                  Finished with a brushed surface and engraved markings, the
                  caseback features essential specifications including water
                  resistance and movement information while maintaining a refined
                  appearance.
                </p>

                <p>
                  Designed to feel understated rather than excessive, every detail
                  serves a purpose while reinforcing the watch’s modern character.
                </p>

              </div>

            </div>

            {/* THE MOVEMENT */}
            <div className="grid gap-12 md:grid-cols-2">

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  The Movement
                </p>

              </div>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-300">

                <p>
                  THARU is powered by a reliable quartz movement selected for its
                  accuracy, consistency, and everyday practicality.
                </p>

                <p>
                  Designed for dependable timekeeping with minimal maintenance, the
                  movement delivers a straightforward experience focused on precision
                  and ease of use.
                </p>

                <p>
                  Built to support daily wear, it reflects THARU’s approach to
                  creating watches that feel refined, functional, and intentionally
                  uncomplicated.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}