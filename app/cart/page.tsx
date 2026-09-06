"use client";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const total = cart.reduce(
    (acc, item) => {
      const price = Number(
        item.price.replace(/[^0-9]/g, "")
      );

      return (
        acc +
        price * item.quantity
      );
    },
    0
  );

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-4 pb-20 pt-28 md:px-6 md:pt-32">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-10 text-4xl font-light md:text-6xl">
            Cart
          </h1>

          {/* EMPTY CART */}

          {cart.length === 0 ? (

            <div className="text-neutral-400">

              <p>
                Your cart is empty.
              </p>

              <div className="mt-8">

                <Link
                  href="/shop"
                  className="inline-flex rounded-full border border-neutral-700 px-6 py-3 transition hover:border-white"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          ) : (

            <>

              {/* CART ITEMS */}

              <div className="space-y-6">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 rounded-[28px] border border-neutral-800 bg-neutral-950 p-4 md:gap-6 md:p-5"
                  >

                    {/* IMAGE */}

                    <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[20px] bg-black md:h-[160px] md:w-[160px]">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                          draggable={false}
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center px-4 text-center">

                          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-700">
                            No image
                          </span>

                        </div>

                      )}

                    </div>

                    {/* INFO */}

                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                      <div>

                        <h2 className="text-lg font-light md:text-2xl">
                          {item.name}
                        </h2>

                        <p className="mt-2 text-neutral-400">
                          {item.price}
                        </p>

                      </div>

                      {/* QUANTITY + REMOVE */}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                        {/* QUANTITY */}

                        <div className="flex items-center rounded-full border border-neutral-700">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(
                                  1,
                                  item.quantity - 1
                                )
                              )
                            }
                            className="px-4 py-2 transition hover:bg-white hover:text-black"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span className="min-w-[40px] text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="px-4 py-2 transition hover:bg-white hover:text-black"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                          className="text-sm text-neutral-500 transition hover:text-white"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* TOTAL */}

              <div className="mt-10 flex items-center justify-between border-t border-neutral-800 pt-8">

                <p className="text-lg text-neutral-400">
                  Total
                </p>

                <p className="text-2xl font-light">
                  ₦
                  {total.toLocaleString()}
                </p>

              </div>

              {/* BUTTONS */}

<div className="mt-10 flex flex-col items-start gap-6">

  {/* PROCEED TO CHECKOUT */}

  <Link
    href="/checkout"
    className="w-full rounded-full bg-white px-8 py-3 text-center text-black transition hover:bg-neutral-200 sm:w-auto"
  >
    Proceed to Checkout
  </Link>

  {/* CONTINUE SHOPPING */}

  <Link
    href="/shop"
    className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-neutral-400 transition hover:text-white"
  >
    <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
      ←
    </span>

    <span>
      Continue Shopping
    </span>
  </Link>

</div>

            </>

          )}

        </div>

      </section>

      <Footer />

    </main>
  );
}