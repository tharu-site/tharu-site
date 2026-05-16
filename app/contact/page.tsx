"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch(
        "/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      if (res.ok) {

        setSuccess(true);

        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }

    } catch (error) {

      console.log(error);

    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">

        <div className="mx-auto max-w-6xl">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Contact
          </p>

          <h1 className="max-w-4xl text-5xl font-light leading-tight md:text-7xl">
            Connect with THARU.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            For product inquiries, support,
            partnerships, orders, or general
            questions, feel free to contact us.
          </p>

        </div>

      </section>

      {/* CONTACT GRID */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">

          {/* LEFT */}
          <div className="rounded-[32px] border border-neutral-900 bg-neutral-950 p-8 md:p-10">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
              Contact Information
            </p>

            <div className="mt-10 space-y-10">

              <div>

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Email
                </p>

                <a
                  href="mailto:tharuwatch@gmail.com"
                  className="mt-3 inline-block text-lg font-light transition hover:text-neutral-300 md:text-2xl"
                >
                  tharuwatch@gmail.com
                </a>

              </div>

              <div>

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  WhatsApp
                </p>

                <a
                  href="https://wa.me/2340000000000"
                  target="_blank"
                  className="mt-3 inline-block text-lg font-light transition hover:text-neutral-300 md:text-2xl"
                >
                  Chat on WhatsApp
                </a>

              </div>

              <div>

                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Location
                </p>

                <p className="mt-3 text-lg font-light text-neutral-300 md:text-2xl">
                  Abuja, Nigeria
                </p>

              </div>

            </div>

            {/* SOCIALS */}
            <div className="mt-14 flex items-center gap-6">

              <a
                href="https://www.instagram.com/tharu.watches?igsh=cndwOTNrM3hmMTJ3"
                target="_blank"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition hover:border-white hover:text-white"
              >
                <FaInstagram size={22} />
              </a>

              <a
                href="https://wa.me/2349020816141"
                target="_blank"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition hover:border-white hover:text-white"
              >
                <FaWhatsapp size={22} />
              </a>

            </div>

          </div>

          {/* RIGHT */}
          <div className="rounded-[32px] border border-neutral-900 bg-neutral-950 p-8 md:p-10">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
              Send a Message
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >

              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-black px-6 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-black px-6 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
              />

              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject: e.target.value,
                  })
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-black px-6 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
              />

              <textarea
                placeholder="Your Message"
                rows={6}
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                className="w-full rounded-[28px] border border-neutral-800 bg-black px-6 py-5 text-white outline-none transition focus:border-white placeholder:text-neutral-600"
              />

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-full bg-white text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:opacity-50"
              >

                {loading
                  ? "Sending..."
                  : success
                  ? "Message Sent"
                  : "Send Message"}

              </button>

            </form>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}