"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-neutral-800 bg-black/60 backdrop-blur-xl">

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-5">

          {/* LEFT / HOME BUTTON */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80 md:gap-3"
          >

            <Image
              src="/logo2.png"
              alt="THARU Logo"
              width={38}
              height={38}
              className="object-contain"
              priority
            />

            <Image
              src="/tharu-wordmark1.png"
              alt="THARU"
              width={140}
              height={40}
              priority
              className="h-auto w-[50px] object-contain md:w-[70px]"
            />

          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden items-center gap-10 text-sm uppercase tracking-[0.2em] text-neutral-400 md:flex">

            <Link href="/" className="nav-link">
              Home
            </Link>

            <Link href="/shop" className="nav-link">
              Shop
            </Link>

            <Link href="/about" className="nav-link">
              About
            </Link>

            <Link href="/contact" className="nav-link">
              Contact
            </Link>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* DESKTOP CART ICON */}
            <Link
              href="/cart"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-neutral-700 text-white transition hover:border-white md:flex"
              aria-label="Cart"
            >

              <ShoppingBag size={18} />

            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center text-white transition hover:opacity-80 md:hidden"
              aria-label="Open Menu"
            >

              <Menu size={24} />

            </button>

          </div>

        </div>

      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-black">

          {/* TOP */}
          <div className="flex items-center justify-between px-8 py-8">

            {/* MOBILE HOME BUTTON */}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="transition-opacity hover:opacity-80"
            >

              <Image
                src="/tharu-wordmark1.png"
                alt="THARU"
                width={120}
                height={40}
                className="h-auto w-[70px] object-contain"
              />

            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center text-white transition hover:opacity-80"
              aria-label="Close Menu"
            >

              <X size={28} />

            </button>

          </div>

          {/* MENU LINKS */}
          <div className="mt-12 flex flex-col gap-6 px-8 text-xl uppercase tracking-[0.25em] text-neutral-300">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="transition hover:text-white"
            >
              Shop
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="transition hover:text-white"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="transition hover:text-white"
            >
              Contact
            </Link>

            {/* MOBILE CART */}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center gap-3 text-xl uppercase tracking-[0.25em] text-neutral-300 transition hover:text-white"
            >

              <ShoppingBag size={20} />

              Cart

            </Link>

          </div>

        </div>
      )}
    </>
  );
}