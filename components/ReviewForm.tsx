"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

const MIN_REVIEW_LENGTH = 10;
const MAX_REVIEW_LENGTH = 500;

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    /*
     * CLEAN INPUT
     */

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanReview =
      review.trim();

    /*
     * NAME VALIDATION
     */

    if (!cleanName) {
      setMessage(
        "Please enter your name."
      );
      return;
    }

    if (cleanName.length < 2) {
      setMessage(
        "Your name must contain at least 2 characters."
      );
      return;
    }

    if (cleanName.length > 80) {
      setMessage(
        "Your name is too long."
      );
      return;
    }

    /*
     * EMAIL VALIDATION
     */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setMessage(
        "Please enter your email address."
      );
      return;
    }

    if (
      !emailPattern.test(
        cleanEmail
      )
    ) {
      setMessage(
        "Please enter a valid email address."
      );
      return;
    }

    /*
     * RATING VALIDATION
     */

    if (
      rating < 1 ||
      rating > 5
    ) {
      setMessage(
        "Please select a rating between 1 and 5 stars."
      );
      return;
    }

    /*
     * REVIEW VALIDATION
     */

    if (!cleanReview) {
      setMessage(
        "Please write a review."
      );
      return;
    }

    if (
      cleanReview.length <
      MIN_REVIEW_LENGTH
    ) {
      setMessage(
        `Your review must contain at least ${MIN_REVIEW_LENGTH} characters.`
      );
      return;
    }

    if (
      cleanReview.length >
      MAX_REVIEW_LENGTH
    ) {
      setMessage(
        `Your review cannot exceed ${MAX_REVIEW_LENGTH} characters.`
      );
      return;
    }

    /*
     * BASIC SPAM CHECK
     *
     * Prevent obvious repeated-character
     * submissions such as:
     *
     * "aaaaaaaaaaaaaaaa"
     */

    const repeatedCharacters =
      /(.)\1{7,}/;

    if (
      repeatedCharacters.test(
        cleanReview
      )
    ) {
      setMessage(
        "Please enter a genuine review."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * CHECK FOR AN EXISTING
       * IDENTICAL REVIEW
       *
       * This gives the customer a friendly
       * message instead of exposing a database
       * constraint error.
       */

      const {
        data: existingReview,
        error: duplicateCheckError,
      } = await supabase
        .from("reviews")
        .select("id")
        .eq("email", cleanEmail)
        .ilike(
          "review",
          cleanReview
        )
        .limit(1);

      if (duplicateCheckError) {
        console.error(
          "Duplicate check error:",
          duplicateCheckError
        );

        setMessage(
          "We couldn't verify your review. Please try again."
        );

        return;
      }

      if (
        existingReview &&
        existingReview.length > 0
      ) {
        setMessage(
          "You have already submitted this review."
        );

        return;
      }

      /*
       * INSERT REVIEW
       *
       * approved is intentionally false.
       * The review must be approved by the
       * admin before appearing publicly.
       */

      const {
        error: insertError,
      } = await supabase
        .from("reviews")
        .insert({
          name: cleanName,
          email: cleanEmail,
          rating,
          review: cleanReview,
        });

      if (insertError) {
        console.error(
          "Review submission error:",
          insertError
        );

        /*
         * Handle the database duplicate
         * constraint as well.
         */

        if (
          insertError.code ===
          "23505"
        ) {
          setMessage(
            "You have already submitted this review."
          );

          return;
        }

        setMessage(
          "Something went wrong while submitting your review. Please try again."
        );

        return;
      }

      /*
       * SUCCESS
       */

      setSuccess(true);

      setMessage(
        "Thank you. Your review has been submitted and is now live."
      );

      /*
       * RESET FORM
       */

      setName("");
      setEmail("");
      setRating(5);
      setReview("");

    } catch (error) {

      console.error(
        "Unexpected review error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-neutral-800 bg-neutral-950 p-6 md:p-8"
      >

        {/* HEADER */}

        <div className="mb-8">

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">
            Your Experience
          </p>

          <h3 className="text-2xl font-light md:text-3xl">
            Leave a Review
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Tell us about your THARU experience.
          </p>

        </div>

        {/* NAME */}

        <div className="mb-5">

          <label
            htmlFor="review-name"
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500"
          >
            Name
          </label>

          <input
            id="review-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Your name"
            className="h-14 w-full rounded-full border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
          />

        </div>

        {/* EMAIL */}

        <div className="mb-5">

          <label
            htmlFor="review-email"
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500"
          >
            Email
          </label>

          <input
            id="review-email"
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="you@example.com"
            className="h-14 w-full rounded-full border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
          />

          <p className="mt-2 text-[11px] text-neutral-600">
            Your email will not be displayed publicly.
          </p>

        </div>

        {/* RATING */}

        <div className="mb-6">

          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            Rating
          </p>

          <div className="flex gap-2">

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  aria-label={`Give ${star} star${
                    star === 1
                      ? ""
                      : "s"
                  }`}
                  className={`text-2xl transition ${
                    star <= rating
                      ? "text-white"
                      : "text-neutral-700"
                  } hover:text-white`}
                >
                  ★
                </button>

              )
            )}

          </div>

          <p className="mt-2 text-xs text-neutral-600">
            {rating} out of 5
          </p>

        </div>

        {/* REVIEW */}

        <div className="mb-6">

          <div className="mb-2 flex items-center justify-between">

            <label
              htmlFor="review-text"
              className="block text-xs uppercase tracking-[0.2em] text-neutral-500"
            >
              Review
            </label>

            <span className="text-[11px] text-neutral-600">
              {review.length}/
              {MAX_REVIEW_LENGTH}
            </span>

          </div>

          <textarea
            id="review-text"
            required
            minLength={
              MIN_REVIEW_LENGTH
            }
            maxLength={
              MAX_REVIEW_LENGTH
            }
            value={review}
            onChange={(event) =>
              setReview(
                event.target.value
              )
            }
            placeholder="Tell us about your experience..."
            rows={6}
            className="w-full resize-none rounded-[24px] border border-neutral-800 bg-black px-5 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
          />

          <p className="mt-2 text-[11px] text-neutral-600">
            Minimum {MIN_REVIEW_LENGTH} characters.
          </p>

        </div>

        {/* MESSAGE */}

        {message && (

          <div
            className={`mb-6 rounded-[20px] border px-5 py-4 text-sm leading-relaxed ${
              success
                ? "border-neutral-700 bg-neutral-950 text-neutral-300"
                : "border-neutral-800 bg-neutral-950 text-neutral-400"
            }`}
          >
            {message}
          </div>

        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-full bg-white text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

        {/* BACK */}

        <div className="mt-6 text-center">

          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:text-white"
          >
            Back to THARU
          </Link>

        </div>

      </form>

    </div>
  );
}