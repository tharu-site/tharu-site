"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useCart } from "@/components/CartContext";
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

  case_diameter: string | null;
  case_height: string | null;
  lug_to_lug: string | null;
  crystal: string | null;
  case_material: string | null;
  movement: string | null;
  water_resistance: string | null;
  strap_width: string | null;
  strap_material: string | null;
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId =
    params.id as string;

  const { addToCart } =
    useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [strap, setStrap] =
    useState<"black" | "brown">(
      "black"
    );

  const [quantity, setQuantity] =
    useState(1);

  /*
   * LOAD PRODUCT
   */

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error(
          "Error loading product:",
          error
        );

        setError(
          "Unable to load this product."
        );

        setLoading(false);

        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white">

        <Navbar />

        <div className="flex min-h-screen items-center justify-center">

          <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
            Loading product...
          </p>

        </div>

      </main>
    );
  }

  /*
   * PRODUCT NOT FOUND
   */

  if (!product) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white">

        <Navbar />

        <div className="flex min-h-screen items-center justify-center px-6 text-center">

          <div>

            <h1 className="text-4xl font-light">
              Product not found
            </h1>

            <p className="mt-4 text-sm text-neutral-500">
              {error ||
                "This product could not be found."}
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full border border-neutral-700 px-6 py-3 text-xs uppercase tracking-[0.2em] transition hover:border-white"
            >
              Back To Shop
            </Link>

          </div>

        </div>

      </main>
    );
  }

  /*
   * CURRENT IMAGE
   */

  const currentImage =
    strap === "black"
      ? product.black_image
      : product.brown_image;

  /*
   * SOLD OUT
   *
   * The product is unavailable if:
   *
   * 1. Admin manually marked it sold out
   * OR
   * 2. Stock is actually zero
   */

  const outOfStock =
    product.is_sold_out ||
    product.stock <= 0;

  /*
   * ADD TO CART
   */

  const handleAddToCart = () => {
    if (outOfStock) return;

    addToCart({
      id: `${product.id}-${strap}`,

      name:
        `${product.name} (${strap} strap)`,

      price:
        `₦${Number(
          product.price
        ).toLocaleString()}`,

      image:
        currentImage ||
        product.black_image ||
        product.brown_image ||
        "",

      quantity,
    });

    router.push("/cart");
  };

  /*
   * BUY NOW
   */

  const handleBuyNow = () => {
    if (outOfStock) return;

    addToCart({
      id: `${product.id}-${strap}`,

      name:
        `${product.name} (${strap} strap)`,

      price:
        `₦${Number(
          product.price
        ).toLocaleString()}`,

      image:
        currentImage ||
        product.black_image ||
        product.brown_image ||
        "",

      quantity,
    });

    router.push("/cart");
  };

  /*
   * TECHNICAL SPECIFICATIONS
   */

  const specs = [
    [
      "Case Diameter",
      product.case_diameter,
    ],
    [
      "Case Height",
      product.case_height,
    ],
    [
      "Lug-to-Lug",
      product.lug_to_lug,
    ],
    [
      "Crystal",
      product.crystal,
    ],
    [
      "Case Material",
      product.case_material,
    ],
    [
      "Movement",
      product.movement,
    ],
    [
      "Water Resistance",
      product.water_resistance,
    ],
    [
      "Strap Width",
      product.strap_width,
    ],
    [
      "Strap Material",
      product.strap_material,
    ],
  ].filter(
    ([, value]) => value
  );

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-6 pb-20 pt-28 md:px-10 md:pt-32">

        <div className="mx-auto grid max-w-7xl items-start gap-12 md:grid-cols-2 md:gap-20">

          {/* IMAGE */}

          <div className="self-start overflow-hidden rounded-[32px] border border-neutral-800 bg-black">

            <div className="relative aspect-square w-full overflow-hidden rounded-[30px]">

              {currentImage ? (

                <img
                  src={currentImage}
                  alt={product.name}
                  className={`h-full w-full object-cover ${
                    outOfStock
                      ? "opacity-60"
                      : ""
                  }`}
                />

              ) : (

                <div className="flex h-full items-center justify-center">

                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                    No image available
                  </p>

                </div>

              )}

              {/* SOLD OUT BADGE */}

              {outOfStock && (
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/80 px-4 py-2 backdrop-blur-md">

                  <span className="text-[10px] uppercase tracking-[0.25em] text-white">
                    Sold Out
                  </span>

                </div>
              )}

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

            {product.description && (
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-neutral-300">
                {product.description}
              </p>
            )}

            {/* PRICE */}

            <div className="mt-8">

              <p className="text-4xl text-white">
                ₦
                {Number(
                  product.price
                ).toLocaleString()}
              </p>

              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-neutral-500">
                Official Retail Price
              </p>

            </div>

            {/* STOCK / SOLD OUT */}

            <div className="mt-6">

              {outOfStock ? (

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 px-5 py-4">

                  <p className="text-sm uppercase tracking-[0.2em] text-white">
                    Currently Sold Out
                  </p>

                  <p className="mt-2 text-xs text-neutral-600">
                    This product is currently unavailable for purchase.
                  </p>

                </div>

              ) : (

                <p className="text-sm text-neutral-500">
                  {product.stock} pieces available
                </p>

              )}

            </div>

            {/* STRAP OPTIONS */}

            <div className="mt-10">

              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-500">
                Strap Colour
              </p>

              <div className="flex gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setStrap("black")
                  }
                  disabled={
                    !product.black_image
                  }
                  className={`rounded-full border px-6 py-2 text-sm transition ${
                    strap === "black"
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 text-white hover:border-white"
                  } ${
                    !product.black_image
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                >
                  Black
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStrap("brown")
                  }
                  disabled={
                    !product.brown_image
                  }
                  className={`rounded-full border px-6 py-2 text-sm transition ${
                    strap === "brown"
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 text-white hover:border-white"
                  } ${
                    !product.brown_image
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                >
                  Brown
                </button>

              </div>

            </div>

            {/* QUANTITY */}

            {!outOfStock && (
              <div className="mt-10">

                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-500">
                  Quantity
                </p>

                <div className="flex w-fit items-center rounded-full border border-neutral-700">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (prev) =>
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
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (prev) =>
                          Math.min(
                            product.stock,
                            prev + 1
                          )
                      )
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                    className="px-5 py-2 text-lg transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-10 flex flex-col gap-4">

              <button
                type="button"
                onClick={
                  handleBuyNow
                }
                disabled={
                  outOfStock
                }
                className="rounded-full bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
              >
                {outOfStock
                  ? "Sold Out"
                  : "Buy Now"}
              </button>

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  outOfStock
                }
                className="rounded-full border border-neutral-700 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:border-white disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-600"
              >
                {outOfStock
                  ? "Unavailable"
                  : "Add To Cart"}
              </button>

            </div>

            {/* DELIVERY */}

            {!outOfStock && (
              <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-neutral-600">
                Delivery takes 3–5 business days
              </p>
            )}

            {/* SPECS */}

            {specs.length > 0 && (
              <div className="mt-16 border-t border-neutral-800 pt-10">

                <h2 className="mb-8 text-2xl font-light">
                  Technical Specifications
                </h2>

                <div className="space-y-5">

                  {specs.map(
                    ([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-6 border-b border-neutral-800 pb-4"
                      >

                        <p className="text-neutral-500">
                          {label}
                        </p>

                        <p className="text-right text-white">
                          {value}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}