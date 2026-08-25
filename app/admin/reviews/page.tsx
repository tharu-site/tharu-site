"use client";

import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

type Review = {
  id: string;
  name: string;
  rating: number;
  review: string;
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * LOAD REVIEWS
   */

  useEffect(() => {
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
        });

      if (error) {
        console.error(
          "Error loading reviews:",
          error
        );

        setError(
          "Unable to load reviews."
        );

        setLoading(false);

        return;
      }

      setReviews(data || []);

      setLoading(false);
    };

    fetchReviews();
  }, []);

  /*
   * DELETE REVIEW
   */

  const handleDelete = async (
    review: Review
  ) => {
    setError("");
    setSuccess("");

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the review from "${review.name}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(review.id);

    const {
      error: deleteError,
    } = await supabase
      .from("reviews")
      .delete()
      .eq("id", review.id);

    if (deleteError) {
      console.error(
        "Delete review error:",
        deleteError
      );

      setError(
        "Unable to delete this review."
      );

      setDeletingId(null);

      return;
    }

    setReviews((prev) =>
      prev.filter(
        (item) =>
          item.id !== review.id
      )
    );

    setSuccess(
      `Review from ${review.name} was deleted successfully.`
    );

    setDeletingId(null);
  };

  /*
   * FORMAT DATE
   */

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">

        <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
          THARU Store
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-5xl">
          Reviews
        </h1>

        <div className="mt-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading reviews...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Store
        </p>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

          <div>

            <h1 className="text-4xl font-light md:text-5xl">
              Reviews
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              View and manage customer reviews.
            </p>

          </div>

          <div className="rounded-full border border-neutral-800 px-5 py-3">

            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              {reviews.length}{" "}
              {reviews.length === 1
                ? "Review"
                : "Reviews"}
            </span>

          </div>

        </div>

      </div>

      {/* SUCCESS */}

      {success && (
        <div className="mb-8 rounded-[20px] border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-300">
          {success}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="mb-8 rounded-[20px] border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-400">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {reviews.length === 0 && (
        <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-12 text-center">

          <h2 className="text-xl font-light">
            No reviews yet
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            Customer reviews will appear here when they are submitted.
          </p>

        </div>
      )}

      {/* REVIEW LIST */}

      {reviews.length > 0 && (
        <div className="space-y-5">

          {reviews.map(
            (review) => (
              <article
                key={review.id}
                className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8"
              >

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                  {/* REVIEW CONTENT */}

                  <div className="min-w-0 flex-1">

                    {/* CUSTOMER */}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">

                      <h2 className="text-xl font-light">
                        {review.name}
                      </h2>

                      <span className="text-xs uppercase tracking-[0.15em] text-neutral-600">
                        {formatDate(
                          review.created_at
                        )}
                      </span>

                    </div>

                    {/* RATING */}

                    <div className="mt-4 flex items-center gap-1">

                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={15}
                            fill={
                              index <
                              review.rating
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              index <
                              review.rating
                                ? "text-white"
                                : "text-neutral-700"
                            }
                          />
                        )
                      )}

                      <span className="ml-2 text-xs text-neutral-600">
                        {review.rating}/5
                      </span>

                    </div>

                    {/* REVIEW */}

                    <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-300">
                      “{review.review}”
                    </p>

                  </div>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        review
                      )
                    }
                    disabled={
                      deletingId ===
                      review.id
                    }
                    className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-neutral-800 px-5 py-3 text-xs uppercase tracking-[0.15em] text-neutral-500 transition hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <Trash2
                      size={14}
                    />

                    {deletingId ===
                    review.id
                      ? "Deleting..."
                      : "Delete"}

                  </button>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </div>
  );
}