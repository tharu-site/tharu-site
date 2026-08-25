"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase";

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  black_image: string | null;
  brown_image: string | null;
};

export default function Hero() {
  const [products, setProducts] =
    useState<FeaturedProduct[]>([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  /*
   * LOAD FEATURED PRODUCTS
   *
   * We find the products using their slugs,
   * then use their real Supabase UUIDs for
   * the product page links.
   */

  useEffect(() => {
    const loadFeaturedProducts =
      async () => {
        const {
          data,
          error,
        } = await supabase
          .from("products")
          .select(
            `
              id,
              name,
              slug,
              black_image,
              brown_image
            `
          )
          .in(
            "slug",
            [
              "originis-noctis",
              "originis-alba",
            ]
          );

        if (error) {
          console.error(
            "Error loading featured products:",
            error
          );

          setLoadingProducts(false);

          return;
        }

        /*
         * Keep the featured products in the
         * desired homepage order:
         *
         * 1. Originis Noctis
         * 2. Originis Alba
         */

        const orderedProducts =
          [
            "originis-noctis",
            "originis-alba",
          ]
            .map(
              (slug) =>
                data?.find(
                  (product) =>
                    product.slug === slug
                )
            )
            .filter(
              (
                product
              ): product is FeaturedProduct =>
                Boolean(product)
            );

        setProducts(
          orderedProducts
        );

        setLoadingProducts(false);
      };

    loadFeaturedProducts();
  }, []);

  /*
   * FIND FEATURED PRODUCTS
   */

  const noctis =
    products.find(
      (product) =>
        product.slug ===
        "originis-noctis"
    );

  const alba =
    products.find(
      (product) =>
        product.slug ===
        "originis-alba"
    );

  return (
    <>
      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-6 pb-6 pt-20 text-center md:min-h-screen md:pb-40 md:pt-40">

        {/* BACKGROUND */}

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
          initial={{
            opacity: 0,
            y: 80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1.2,
          }}
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
            Limited to 120 pieces - no restock.
            Clean design, balanced proportions,
            and a quiet sense of presence.
          </p>

          {/* BUTTON */}

          <div className="mt-5 flex justify-center md:mt-12">

            <Link
              href="/shop"
              className="rounded-full border border-white bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              EXPLORE COLLECTION
            </Link>

          </div>

        </motion.div>

      </section>

      {/* ================================================== */}
      {/* FEATURED PRODUCTS */}
      {/* ================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 80,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.1,
        }}
        viewport={{
          once: true,
        }}
        className="relative z-10 mx-auto -mt-28 w-full max-w-5xl px-6 pb-20 md:mt-12 md:pb-24"
      >

        <div className="grid grid-cols-2 gap-4 md:gap-8">

          {/* ================================================== */}
          {/* NOCTIS */}
          {/* ================================================== */}

          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-3 md:rounded-[32px] md:p-4">

            <div className="relative h-[170px] overflow-hidden rounded-[20px] bg-black md:h-[420px] md:rounded-[24px]">

              {loadingProducts ? (

                <div className="flex h-full items-center justify-center">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-700">
                    Loading
                  </p>

                </div>

              ) : noctis ? (

                /*
                 * Use normal <img> here.
                 *
                 * This allows both:
                 *
                 * 1. Old local paths
                 * 2. Supabase Storage URLs
                 *
                 * to work without changing
                 * next.config.ts.
                 */

                <img
                  src={
                    noctis.black_image ||
                    noctis.brown_image ||
                    "/hero-bg.jpg"
                  }
                  alt="Originis Noctis"
                  className="h-full w-full bg-black object-contain"
                />

              ) : (

                <div className="flex h-full items-center justify-center">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-700">
                    Product unavailable
                  </p>

                </div>

              )}

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

              {noctis && (

                <Link
                  href={`/shop/${noctis.id}`}
                  className="rounded-full border border-neutral-700 px-3 py-1 text-[9px] transition hover:border-white md:px-4 md:py-1.5 md:text-sm"
                >
                  Buy Now
                </Link>

              )}

            </div>

          </div>

          {/* ================================================== */}
          {/* ALBA */}
          {/* ================================================== */}

          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-3 md:rounded-[32px] md:p-4">

            <div className="relative h-[170px] overflow-hidden rounded-[20px] bg-black md:h-[420px] md:rounded-[24px]">

              {loadingProducts ? (

                <div className="flex h-full items-center justify-center">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-700">
                    Loading
                  </p>

                </div>

              ) : alba ? (

                /*
                 * IMPORTANT:
                 *
                 * Alba's black_image is currently
                 * a full Supabase Storage URL.
                 *
                 * We intentionally use normal <img>
                 * instead of Next <Image> here.
                 */

                <img
                  src={
                    alba.black_image ||
                    alba.brown_image ||
                    "/hero-bg.jpg"
                  }
                  alt="Originis Alba"
                  className="h-full w-full bg-black object-contain"
                />

              ) : (

                <div className="flex h-full items-center justify-center">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-700">
                    Product unavailable
                  </p>

                </div>

              )}

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

              {alba && (

                <Link
                  href={`/shop/${alba.id}`}
                  className="rounded-full border border-neutral-700 px-3 py-1 text-[9px] transition hover:border-white md:px-4 md:py-1.5 md:text-sm"
                >
                  Buy Now
                </Link>

              )}

            </div>

          </div>

        </div>

      </motion.section>
    </>
  );
}