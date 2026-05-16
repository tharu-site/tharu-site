"use client";

import { Suspense } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();

  const reference =
    searchParams.get("reference") ||
    "N/A";

  const email =
    searchParams.get("email") ||
    "Not provided";

  const amount =
    searchParams.get("amount") ||
    "0";

  const firstName =
    searchParams.get("firstName") ||
    "Customer";

  const state =
    searchParams.get("state") ||
    "Nigeria";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-4xl">

          {/* TOP */}
          <div className="rounded-[40px] border border-neutral-900 bg-neutral-950 p-8 md:p-12">

            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-neutral-800 bg-black text-4xl">
              ✓
            </div>

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
              Payment Successful
            </p>

            <h1 className="max-w-3xl text-4xl font-light leading-tight md:text-6xl">
              Thank you for your order, {firstName}.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
              Your payment has been successfully processed.
              THARU will begin preparing your order shortly.
            </p>

          </div>

          {/* ORDER SUMMARY */}
          <div className="mt-8 rounded-[40px] border border-neutral-900 bg-neutral-950 p-8 md:p-12">

            <div className="flex items-center justify-between border-b border-neutral-800 pb-6">

              <h2 className="text-2xl font-light md:text-3xl">
                Order Summary
              </h2>

              <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                THARU
              </p>

            </div>

            <div className="mt-8 space-y-8">

              <div className="flex flex-col justify-between gap-3 border-b border-neutral-900 pb-6 md:flex-row md:items-center">

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Order Reference
                </p>

                <p className="text-lg text-white">
                  {reference}
                </p>

              </div>

              <div className="flex flex-col justify-between gap-3 border-b border-neutral-900 pb-6 md:flex-row md:items-center">

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Customer Email
                </p>

                <p className="text-lg text-white">
                  {email}
                </p>

              </div>

              <div className="flex flex-col justify-between gap-3 border-b border-neutral-900 pb-6 md:flex-row md:items-center">

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Delivery State
                </p>

                <p className="text-lg text-white">
                  {state}
                </p>

              </div>

              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Amount Paid
                </p>

                <p className="text-3xl font-light text-white">
                  ₦{Number(amount).toLocaleString()}
                </p>

              </div>

            </div>

            {/* INFO BOX */}
            <div className="mt-10 rounded-[28px] border border-neutral-800 bg-black p-6">

              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                What Happens Next
              </p>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-400 md:text-base">

                <p>
                  • Your order is now being reviewed and prepared.
                </p>

                <p>
                  • THARU may contact you for delivery confirmation.
                </p>

                <p>
                  • Shipping timelines depend on your location within Nigeria.
                </p>

                <p>
                  • You will receive additional updates where applicable.
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/shop"
                className="flex h-14 items-center justify-center rounded-full border border-neutral-700 px-8 text-sm uppercase tracking-[0.2em] transition hover:border-white"
              >
                Continue Shopping
              </Link>

              <Link
                href="/"
                className="flex h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
              >
                Return Home
              </Link>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}