"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-6 text-center md:min-h-screen md:pt-40 md:pb-40">

        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">

          <Image
            src="/hero-bg.jpg"
            alt="THARU Background"
            fill
            priority
            className="object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/65" />

          {/* SOFT GLOW */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />

        </div>

        {/* HERO CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 max-w-5xl"
        >

          {/* ORIGINIS */}
          <p className="mb-3 text-sm font-light tracking-[0.35em] text-neutral-200 md:mb-6 md:text-2xl md:tracking-[0.4em]">

            ORIGINIS

            </p>

          {/* HEADLINE */}
          <h1 className="mx-auto max-w-xl text-3xl font-light leading-tight tracking-tight md:max-w-5xl md:text-7xl">
            Modern watches built with bold restraint.
          </h1>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400 md:mt-8 md:max-w-2xl md:text-lg">
            THARU is built on restraint.
            Clean design, balanced proportions,
            and a quiet sense of presence.
          </p>

          {/* BUTTON */}
          <div className="mt-5 flex justify-center md:mt-12">

            <Link
              href="/shop"
              className="rounded-full border border-white bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >

              Explore Collection

            </Link>

          </div>

        </motion.div>

      </section>

      {/* FEATURED PRODUCTS */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto -mt-28 w-full max-w-5xl px-6 pb-20 md:mt-12 md:pb-24"
      >

        <div className="grid grid-cols-2 gap-4 md:gap-8">

          {/* PRODUCT 1 */}
          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-3 md:rounded-[32px] md:p-4">

            <div className="relative h-[170px] overflow-hidden rounded-[20px] bg-black md:h-[420px] md:rounded-[24px]">

              <Image
                src="/blackstrapblackdial.jpg"
                alt="Black Strap Black Dial"
                fill
                priority
                className="object-contain bg-black"
              />

            </div>

            <div className="flex items-center justify-between px-1 pt-4 md:px-2 md:pt-5">

              <div>

                <h3 className="text-xs font-light md:text-2xl">
                Originis 
                </h3>

                <p className="mt-1 text-[10px] text-neutral-400 md:text-sm">
                Noctis
                </p>

              </div>

              <Link
                href="/shop/originis-black-dial"
                className="rounded-full border border-neutral-700 px-3 py-1 text-[9px] transition hover:border-white md:px-4 md:py-1.5 md:text-sm"
              >

                BUY NOW

              </Link>

            </div>

          </div>

          {/* PRODUCT 2 */}
          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-3 md:rounded-[32px] md:p-4">

            <div className="relative h-[170px] overflow-hidden rounded-[20px] bg-black md:h-[420px] md:rounded-[24px]">

              <Image
                src="/blackstrapwhitedial.jpg"
                alt="Black Strap White Dial"
                fill
                priority
                className="object-contain bg-black"
              />

            </div>

            <div className="flex items-center justify-between px-1 pt-4 md:px-2 md:pt-5">

              <div>

                <h3 className="text-xs font-light md:text-2xl">
                Originis
                </h3>

                <p className="mt-1 text-[10px] text-neutral-400 md:text-sm">
                Alba
                </p>

              </div>

              <Link
                href="/shop/originis-white-dial"
                className="rounded-full border border-neutral-700 px-3 py-1 text-[9px] transition hover:border-white md:px-4 md:py-1.5 md:text-sm"
              >

                BUY NOW

              </Link>

            </div>

          </div>

        </div>

      </motion.section>
    </>
  );
}