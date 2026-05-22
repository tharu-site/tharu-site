"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Autoplay,
  EffectFade,
  Pagination,
} from "swiper/modules";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    image: "/watch1.jpg",
    title: "Limited to 120 pieces",
    desc: "",
    link: "/shop",
  },

  {
    image: "/watch2.jpg",
    title: "Modern Simplicity",
    desc: "Balanced proportions with timeless styling.",
    link: "/shop",
  },

  {
    image: "/lifestyle.jpg",
    title: "Designed To Stand Out",
    desc: "Luxury presence with understated confidence.",
    link: "/shop",
  },
];

export default function CinematicSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative w-full overflow-hidden px-4 py-8 md:px-6 md:py-12">

      <div className="mx-auto w-full max-w-7xl">

        <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px]">

          <Swiper
            modules={[
              Autoplay,
              EffectFade,
              Pagination,
            ]}
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
            speed={1400}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            loop
            slidesPerView={1}
            grabCursor
            allowTouchMove
            simulateTouch
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >

            {slides.map((slide, index) => (
              <SwiperSlide key={index}>

                <div className="relative h-[32vh] overflow-hidden md:h-[50vh]">

                  {/* IMAGE */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/45" />

                  {/* CONTENT */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">

                    <div className="max-w-2xl">

                      <h2 className="whitespace-nowrap text-2xl font-light tracking-tight md:text-7xl">
                    {slide.title}
                    </h2>

                      {slide.desc && (
                        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-300 md:text-lg">
                          {slide.desc}
                        </p>
                      )}

                      <Link
                        href={slide.link}
                        className="mt-8 inline-block rounded-full bg-white px-6 py-2.5 text-xs font-medium tracking-wide text-black transition hover:bg-neutral-200 md:px-8 md:py-3 md:text-sm"
                      >

                        PRE-ORDER

                      </Link>

                    </div>

                  </div>

                </div>

              </SwiperSlide>
            ))}

          </Swiper>

          {/* LEFT ARROW */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black md:left-6"
          >

            <ChevronLeft size={18} />

          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black md:right-6"
          >

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}