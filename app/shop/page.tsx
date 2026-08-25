"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  stock: number;

  /*
   * MANUAL SOLD OUT STATUS
   */
  is_sold_out: boolean;

  black_image: string | null;
  brown_image: string | null;
};

export default function ShopPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProducts = async () => {
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
          short_description,
          description,
          price,
          stock,
          is_sold_out,
          black_image,
          brown_image
          `
        )
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Error loading shop products:",
          error
        );

        setError(
          "Unable to load products."
        );

        setLoading(false);

        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-6 pb-24 pt-28 md:px-10 md:pt-32">

        <div className="mx-auto max-w-7xl">

          {/* LOADING */}

          {loading && (
            <div className="py-24 text-center">

              <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
                Loading collection...
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

              <p className="text-sm text-neutral-400">
                {error}
              </p>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-12 text-center">

                <h2 className="text-2xl font-light">
                  Collection coming soon
                </h2>

                <p className="mt-3 text-sm text-neutral-500">
                  New THARU pieces will appear here.
                </p>

              </div>
            )}

          {/* PRODUCTS */}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div
                className={`mx-auto grid gap-8 ${
                  products.length === 1
                    ? "max-w-xl grid-cols-1"
                    : products.length === 2
                    ? "max-w-5xl grid-cols-1 md:grid-cols-2"
                    : "max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >

                {products.map(
                  (product) => {

                    const image =
                      product.black_image ||
                      product.brown_image;

                    /*
                     * PRODUCT IS SOLD OUT IF:
                     *
                     * 1. Admin manually marked it sold out
                     * OR
                     * 2. Stock is zero
                     */

                    const outOfStock =
                      product.is_sold_out ||
                      product.stock <= 0;

                    return (
                      <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        className="group"
                      >

                        {/* IMAGE */}

                        <div className="relative overflow-hidden rounded-[30px] border border-neutral-800 bg-black">

                          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">

                            {image ? (

                              <img
                                src={image}
                                alt={product.name}
                                className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] ${
                                  outOfStock
                                    ? "opacity-60"
                                    : ""
                                }`}
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">

                                <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                                  No image
                                </p>

                              </div>

                            )}

                            {/* SOLD OUT BADGE */}

                            {outOfStock && (
                              <div className="absolute left-5 top-5 rounded-full border border-neutral-700 bg-black/80 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-300 backdrop-blur">
                                Sold Out
                              </div>
                            )}

                          </div>

                        </div>

                        {/* INFORMATION */}

                        <div className="mt-6">

                          <div className="flex items-start justify-between gap-5">

                            <div>

                              <h2 className="text-xl font-light">
                                {product.name}
                              </h2>

                              <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
                                {
                                  product.short_description
                                }
                              </p>

                            </div>

                            <p className="shrink-0 text-sm text-white">
                              ₦
                              {Number(
                                product.price
                              ).toLocaleString()}
                            </p>

                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-neutral-900 pt-4">

                            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                              {outOfStock
                                ? "View Product"
                                : "View Product"}
                            </span>

                            <span className="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white">
                              →
                            </span>

                          </div>

                        </div>

                      </Link>
                    );
                  }
                )}

              </div>
            )}

        </div>

      </section>

      <Footer />

    </main>
  );
}