"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

type Review = {
  id: string;
  name: string;
  rating: number;
  review: string;
  created_at: string;
};

export default function Reviews() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const trackRef =
    useRef<HTMLDivElement | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const positionRef =
    useRef(0);

  const isDraggingRef =
    useRef(false);

  const startXRef =
    useRef(0);

  const startPositionRef =
    useRef(0);

  const lastTimeRef =
    useRef<number | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  /*
   * FETCH REVIEWS + REALTIME
   *
   * Reviews are visible immediately.
   * Admin can remove them from the
   * admin dashboard.
   */

  useEffect(() => {
    let mounted = true;

    /*
     * LOAD REVIEWS
     */

    const fetchReviews = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("reviews")
        .select(
          "id, name, rating, review, created_at"
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          "Error loading reviews:",
          error
        );

        setReviews([]);
        setLoading(false);

        return;
      }

      setReviews(
        (data as Review[]) || []
      );

      setLoading(false);
    };

    fetchReviews();

    /*
     * REALTIME CHANNEL
     */

    const channel = supabase
      .channel("reviews-homepage")

      /*
       * NEW REVIEW
       */

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          console.log(
            "REALTIME INSERT RECEIVED:",
            payload
          );

          const newReview =
            payload.new as Review;

          if (!newReview?.id) {
            return;
          }

          setReviews((current) => {
            /*
             * Prevent duplicate reviews
             */

            const withoutDuplicate =
              current.filter(
                (review) =>
                  review.id !==
                  newReview.id
              );

            /*
             * Newest review first
             */

            return [
              newReview,
              ...withoutDuplicate,
            ].slice(0, 10);
          });
        }
      )

      /*
       * DELETED REVIEW
       */

      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          console.log(
            "REALTIME DELETE RECEIVED:",
            payload
          );

          const deletedId =
            payload.old?.id;

          if (!deletedId) {
            console.warn(
              "Realtime DELETE received without an ID:",
              payload
            );

            return;
          }

          setReviews((current) =>
            current.filter(
              (review) =>
                review.id !==
                deletedId
            )
          );
        }
      )

      /*
       * UPDATED REVIEW
       */

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          console.log(
            "REALTIME UPDATE RECEIVED:",
            payload
          );

          const updatedReview =
            payload.new as Review;

          if (!updatedReview?.id) {
            return;
          }

          setReviews((current) =>
            current.map((review) =>
              review.id ===
              updatedReview.id
                ? updatedReview
                : review
            )
          );
        }
      )

      /*
       * SUBSCRIBE
       */

      .subscribe((status) => {
        console.log(
          "Reviews realtime status:",
          status
        );
      });

    /*
     * CLEAN UP
     */

    return () => {
      mounted = false;

      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /*
   * APPLY POSITION
   */

  const applyPosition =
    useCallback(() => {
      if (!trackRef.current) {
        return;
      }

      trackRef.current.style.transform =
        `translate3d(${positionRef.current}px, 0, 0)`;
    }, []);

  /*
   * GET LOOP WIDTH
   *
   * Half of the duplicated track
   * represents one complete set.
   */

  const getLoopWidth =
    useCallback(() => {
      if (!trackRef.current) {
        return 0;
      }

      return (
        trackRef.current.scrollWidth / 2
      );
    }, []);

  /*
   * NORMALIZE POSITION
   */

  const normalizePosition =
    useCallback(() => {
      const loopWidth =
        getLoopWidth();

      if (!loopWidth) {
        return;
      }

      if (
        positionRef.current <=
        -loopWidth
      ) {
        positionRef.current +=
          loopWidth;
      }

      if (
        positionRef.current > 0
      ) {
        positionRef.current -=
          loopWidth;
      }

      applyPosition();
    }, [
      applyPosition,
      getLoopWidth,
    ]);

  /*
   * AUTOMATIC SCROLL
   *
   * Lower = slower
   * Higher = faster
   *
   * Current speed: 20
   */

  useEffect(() => {
    if (reviews.length === 0) {
      return;
    }

    const speed = 20;

    const animate = (
      time: number
    ) => {
      if (
        lastTimeRef.current === null
      ) {
        lastTimeRef.current =
          time;
      }

      const delta =
        time -
        lastTimeRef.current;

      lastTimeRef.current =
        time;

      /*
       * Pause automatic movement
       * while the customer is dragging.
       */

      if (!isDraggingRef.current) {
        positionRef.current -=
          (speed * delta) / 1000;

        normalizePosition();
      }

      animationFrameRef.current =
        requestAnimationFrame(
          animate
        );
    };

    animationFrameRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      animationFrameRef.current =
        null;

      lastTimeRef.current =
        null;
    };
  }, [
    reviews.length,
    normalizePosition,
  ]);

  /*
   * RESET MARQUEE POSITION
   *
   * When a review is added or deleted,
   * make sure the marquee is aligned
   * with the new number of reviews.
   */

  useEffect(() => {
    positionRef.current = 0;

    const frame =
      requestAnimationFrame(() => {
        normalizePosition();
      });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [
    reviews.length,
    normalizePosition,
  ]);

  /*
   * POINTER DOWN
   */

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!trackRef.current) {
      return;
    }

    isDraggingRef.current =
      true;

    setIsDragging(true);

    startXRef.current =
      event.clientX;

    startPositionRef.current =
      positionRef.current;

    trackRef.current.setPointerCapture(
      event.pointerId
    );
  };

  /*
   * POINTER MOVE
   */

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      !isDraggingRef.current
    ) {
      return;
    }

    const distance =
      event.clientX -
      startXRef.current;

    positionRef.current =
      startPositionRef.current +
      distance;

    normalizePosition();
  };

  /*
   * POINTER UP
   */

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    isDraggingRef.current =
      false;

    setIsDragging(false);

    if (
      trackRef.current?.hasPointerCapture(
        event.pointerId
      )
    ) {
      trackRef.current.releasePointerCapture(
        event.pointerId
      );
    }

    normalizePosition();
  };

  /*
   * POINTER CANCEL
   */

  const handlePointerCancel =
    () => {
      isDraggingRef.current =
        false;

      setIsDragging(false);

      normalizePosition();
    };

  /*
   * LOADING STATE
   */

  if (loading) {
    return (
      <section
        id="reviews"
        className="border-y border-neutral-900 bg-[#0d0d0d] py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">

          <p className="mb-5 text-sm uppercase tracking-[0.4em] text-neutral-500">
            Customer Experiences
          </p>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <h2 className="max-w-4xl text-4xl font-light leading-tight md:text-6xl">
              Worn. Experienced.
              <br />
              Remembered.
            </h2>

            <Link
              href="/reviews"
              className="w-fit shrink-0 rounded-full border border-neutral-700 px-7 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              Leave a Review
            </Link>

          </div>

        </div>
      </section>
    );
  }

  /*
   * DUPLICATE REVIEWS
   *
   * Two copies create the seamless
   * marquee loop.
   */

  const marqueeReviews = [
    ...reviews,
    ...reviews,
  ];

  return (
    <section
      id="reviews"
      className="overflow-hidden border-y border-neutral-900 bg-[#0d0d0d] py-20 md:py-28"
    >

      {/* HEADER */}

      <div className="mx-auto mb-12 max-w-7xl px-6 md:px-10">

        <p className="mb-5 text-sm uppercase tracking-[0.4em] text-neutral-500">
          Customer Experiences
        </p>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div>

            <h2 className="max-w-4xl text-4xl font-light leading-tight md:text-6xl">

              {reviews.length > 0 ? (
                <>
                  Worn. Experienced.
                  <br />
                  Remembered.
                </>
              ) : (
                <>
                  Be the first to
                  <br />
                  share your experience.
                </>
              )}

            </h2>

            {reviews.length === 0 && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-500 md:text-lg">
                Your experience matters. Tell us
                what you think about your THARU
                watch.
              </p>
            )}

          </div>

          {/* REVIEW BUTTON */}

          <Link
            href="/reviews"
            className="w-fit shrink-0 rounded-full border border-neutral-700 px-7 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white hover:text-black"
          >
            Leave a Review
          </Link>

        </div>

      </div>

      {/* REVIEW MARQUEE */}

      {reviews.length > 0 && (
        <>
          <div
            className={`relative w-full overflow-hidden ${
              isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
            }`}
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerCancel
            }
          >

            <div
              ref={trackRef}
              className="flex w-max select-none touch-pan-y"
            >

              {marqueeReviews.map(
                (
                  review,
                  index
                ) => (
                  <article
                    key={`${review.id}-${index}`}
                    className="mx-3 w-[300px] shrink-0 rounded-[28px] border border-neutral-800 bg-neutral-950 p-7 md:w-[380px] md:p-8"
                  >

                    {/* STARS */}

                    <div className="mb-6 flex gap-1">

                      {Array.from({
                        length: 5,
                      }).map(
                        (
                          _,
                          starIndex
                        ) => (
                          <span
                            key={
                              starIndex
                            }
                            className={
                              starIndex <
                              review.rating
                                ? "text-white"
                                : "text-neutral-700"
                            }
                          >
                            ★
                          </span>
                        )
                      )}

                    </div>

                    {/* REVIEW */}

                    <p className="min-h-[120px] text-base leading-relaxed text-neutral-300 md:text-lg">
                      “{review.review}”
                    </p>

                    {/* CUSTOMER */}

                    <div className="mt-8 border-t border-neutral-800 pt-5">

                      <p className="text-sm uppercase tracking-[0.2em] text-white">
                        {review.name}
                      </p>

                      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-neutral-600">
                        THARU Customer
                      </p>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

          {/* DRAG INSTRUCTION */}

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-700">
            Drag to explore
          </p>
        </>
      )}

    </section>
  );
}