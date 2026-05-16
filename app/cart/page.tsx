"use client";

import Image from "next/image";
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

      return acc + price * item.quantity;

    },
    0
  );

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-4 pt-28 pb-20 md:px-6 md:pt-32">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-10 text-4xl font-light md:text-6xl">
            Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-neutral-400">

              Your cart is empty.

              <div className="mt-8">

                <Link
                  href="/shop"
                  className="rounded-full border border-neutral-700 px-6 py-3 transition hover:border-white"
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
                    className="flex gap-4 rounded-[28px] border border-neutral-800 bg-neutral-950 p-4"
                  >

                    {/* IMAGE */}
                    <div className="relative h-[120px] w-[120px] overflow-hidden rounded-[20px] bg-black">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />

                    </div>

                    {/* INFO */}
                    <div className="flex flex-1 flex-col justify-between">

                      <div>

                        <h2 className="text-lg font-light md:text-2xl">
                          {item.name}
                        </h2>

                        <p className="mt-2 text-neutral-400">
                          {item.price}
                        </p>

                      </div>

                      {/* QUANTITY */}
                      <div className="mt-4 flex items-center justify-between">

                        <div className="flex items-center rounded-full border border-neutral-700">

                          <button
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
                          >

                            −

                          </button>

                          <span className="min-w-[40px] text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="px-4 py-2 transition hover:bg-white hover:text-black"
                          >

                            +

                          </button>

                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
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
                  ₦{total.toLocaleString()}
                </p>

              </div>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/shop"
                  className="rounded-full border border-neutral-700 px-8 py-3 text-center transition hover:border-white"
                >

                  Continue Shopping

                </Link>

                <Link
                  href="/checkout"
                  className="rounded-full bg-white px-8 py-3 text-center text-black transition hover:bg-neutral-200"
                >

                  Proceed to Checkout

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