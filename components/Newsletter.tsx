"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
          }),
        }
      );

      if (response.ok) {
        setSuccess(true);

        setName("");
        setEmail("");
        setPhone("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-neutral-900 px-6 py-20 md:py-32">

      <div className="mx-auto max-w-5xl overflow-hidden rounded-[40px] border border-neutral-800 bg-neutral-950">

        {/* TOP SECTION */}
        <div className="px-8 py-16 text-center md:px-16">

          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-neutral-500">
            Newsletter
          </p>

          <h2 className="mx-auto max-w-4xl text-5xl font-light leading-tight md:text-6xl">
            Stay connected with THARU.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Receive product releases,
            editorials, exclusive launches,
            and updates from THARU.
          </p>

        </div>

        {/* FORM */}
        <div className="border-t border-neutral-800 px-8 py-10 md:px-16">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            <input
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your Name"
              className="h-14 rounded-full border border-neutral-800 bg-black px-6 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email Address"
              className="h-14 rounded-full border border-neutral-800 bg-black px-6 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Phone Number"
              className="h-14 rounded-full border border-neutral-800 bg-black px-6 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 rounded-full bg-white px-10 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >

              {loading
                ? "Subscribing..."
                : "Subscribe"}

            </button>

            <AnimatePresence>

  {success && (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 10,
      }}
      transition={{
        duration: 0.5,
      }}
      className="pt-5"
    >

      <div className="rounded-[24px] border border-neutral-800 bg-black/60 px-6 py-5 text-center backdrop-blur-sm">

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">

          THARU

        </p>

        <p className="mt-2 text-sm text-neutral-300 md:text-base">

          You are now connected to future releases,
          editorials, and limited collections.

        </p>

      </div>

    </motion.div>
  )}

</AnimatePresence>

          </form>

        </div>

      </div>

    </section>
  );
}