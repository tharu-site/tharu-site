"use client";

import { use } from "react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useCart } from "@/components/CartContext";
import { products } from "@/components/products";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const router = useRouter();

  const { addToCart } = useCart();

  const { id } = use(params);

  const product = products.find(
    (p) => p.id === id
  );

  const [strap, setStrap] =
    useState<"black" | "brown">(
      "black"
    );

  const [quantity, setQuantity] =
    useState(1);

  if (!product) {

    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white">

        <Navbar />

        <div className="flex min-h-screen items-center justify-center px-6 text-center">

          <div>

            <h1 className="text-4xl font-light">
              Product not found
            </h1>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full border border-neutral-700 px-6 py-3 transition hover:border-white"
            >

              Back To Shop

            </Link>

          </div>

        </div>

      </main>
    );
  }

  const currentImage =
    product.variants[strap];

  /* ADD TO CART */
  const handleAddToCart = () => {

    addToCart({
      id: `${product.id}-${strap}`,

      name:
        `${product.name} (${strap} strap)`,

      price: product.basePrice,

      image: currentImage,

      quantity,
    });

    router.push("/cart");
  };

  /* BUY NOW */
  const handleBuyNow = () => {

    addToCart({
      id: `${product.id}-${strap}`,

      name:
        `${product.name} (${strap} strap)`,

      price: product.basePrice,

      image: currentImage,

      quantity,
    });

    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-6 pt-28 pb-20 md:pt-32">

        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-20">

          {/* IMAGE */}
          <div className="overflow-hidden rounded-[32px] border border-neutral-800 bg-black">

            <div className="relative h-[420px] md:h-[750px]">

              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-contain"
              />

            </div>

          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
              THARU
            </p>

            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              {product.name}
            </h1>

            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-neutral-300">
            {product.description}
            </p>

            {/* PRICE */}
            <div className="mt-8">

              <div className="flex items-center gap-4">

                <p className="text-4xl text-white">
                  {product.basePrice}
                </p>

                <p className="text-lg text-neutral-500 line-through">
                  {product.originalPrice}
                </p>

              </div>

              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-neutral-500">
                Pre-Launch Price
              </p>

              {/* BADGE */}
              <div className="mt-5 inline-flex rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2">

                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                  Limited Pre-Launch Offer
                </p>

              </div>

            </div>

            {/* STRAP OPTIONS */}
            <div className="mt-10">

              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-500">
                Strap Colour
              </p>

              <div className="flex gap-4">

                <button
                  onClick={() =>
                    setStrap("black")
                  }
                  className={`rounded-full border px-6 py-2 text-sm transition ${
                    strap === "black"
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 text-white hover:border-white"
                  }`}
                >

                  Black

                </button>

                <button
                  onClick={() =>
                    setStrap("brown")
                  }
                  className={`rounded-full border px-6 py-2 text-sm transition ${
                    strap === "brown"
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 text-white hover:border-white"
                  }`}
                >

                  Brown

                </button>

              </div>

            </div>

            {/* QUANTITY */}
            <div className="mt-10">

              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-500">
                Quantity
              </p>

              <div className="flex w-fit items-center rounded-full border border-neutral-700">

                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.max(
                        1,
                        prev - 1
                      )
                    )
                  }
                  className="px-5 py-2 text-lg transition hover:bg-white hover:text-black"
                >

                  −

                </button>

                <span className="min-w-[50px] text-center text-sm">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      (prev) =>
                        prev + 1
                    )
                  }
                  className="px-5 py-2 text-lg transition hover:bg-white hover:text-black"
                >

                  +

                </button>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col gap-4">

              {/* BUY NOW */}
              <button
                onClick={handleBuyNow}
                className="rounded-full bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
              >

                Buy Now

              </button>

              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                className="rounded-full border border-neutral-700 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:border-white"
              >

                Add To Cart

              </button>

            </div>

            {/* SPECS */}
            <div className="mt-16 border-t border-neutral-800 pt-10">

              <h2 className="mb-8 text-2xl font-light">
                Technical Specifications
              </h2>

              <div className="space-y-5">

                {product.specs.map(
                  (
                    [label, value],
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-neutral-800 pb-4"
                    >

                      <p className="text-neutral-500">
                        {label}
                      </p>

                      <p className="text-white">
                        {value}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>
          

        </div>

      </section>

      <Footer />

    </main>
  );
}