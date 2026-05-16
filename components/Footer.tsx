import Link from "next/link";

import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black px-6 py-16 text-white md:px-10 md:py-24">

      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-4">

        {/* BRAND */}
        <div>

          <h3 className="text-xl font-light tracking-[0.25em]">
            THARU
          </h3>

          <p className="mt-6 max-w-xs text-sm leading-relaxed text-neutral-500">

            Built on restraint.
            Clean proportions, quiet presence,
            and timeless design.

          </p>

        </div>

        {/* LEGAL */}
        <div>

          <h4 className="mb-6 text-lg font-light">
            Legal
          </h4>

          <div className="flex flex-col gap-5 text-sm text-neutral-500">

            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/returns-refunds"
              className="transition hover:text-white"
            >
              Returns & Refunds
            </Link>

            <Link
              href="/shipping-policy"
              className="transition hover:text-white"
            >
              Shipping Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms of Service
            </Link>

          </div>

        </div>

        {/* BRAND */}
        <div>

          <h4 className="mb-6 text-lg font-light">
            Brand
          </h4>

          <div className="flex flex-col gap-5 text-sm text-neutral-500">

            <Link
              href="/about"
              className="transition hover:text-white"
            >
              About Us
            </Link>

            <Link
              href="/shop"
              className="transition hover:text-white"
            >
              Collection
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>

          </div>

        </div>

        {/* CONTACT */}
        <div>

          <h4 className="mb-6 text-lg font-light">
            Contact
          </h4>

          <div className="space-y-5 text-sm text-neutral-500">

            <p>
              tharuwatch@gmail.com
            </p>

            <p>
              Abuja, Nigeria
            </p>

          </div>

          {/* SOCIALS */}
          <div className="mt-8 flex items-center gap-5">

            {/* INSTAGRAM */}
            <Link
              href="https://www.instagram.com/tharu.watches?igsh=cndwOTNrM3hmMTJ3"
              target="_blank"
              className="text-neutral-500 transition hover:text-white"
            >

              <FaInstagram size={20} />

            </Link>

            {/* WHATSAPP */}
            <Link
              href="https://wa.me/2349020816141"
              target="_blank"
              className="text-neutral-500 transition hover:text-white"
            >

              <FaWhatsapp size={20} />

            </Link>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-neutral-900 pt-8 text-sm text-neutral-600 md:flex-row">

        <p>
          © 2026 THARU
        </p>

        <p>
          Designed with restraint.
        </p>

      </div>

    </footer>
  );
}