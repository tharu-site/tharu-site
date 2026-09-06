"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * LOAD BLOG POSTS
   */

  const loadPosts = async () => {
    setLoading(true);
    setError("");

    const {
      data,
      error: postsError,
    } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, category, author, published, published_at, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (postsError) {
      console.error(
        "Blog posts error:",
        postsError
      );

      setError(
        postsError.message ||
          "Unable to load blog posts."
      );

      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  /*
   * DELETE POST
   */

  const handleDelete = async (
    id: string,
    title: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    const {
      error: deleteError,
    } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "Delete blog post error:",
        deleteError
      );

      setError(
        deleteError.message ||
          "Unable to delete article."
      );

      return;
    }

    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post.id !== id
      )
    );
  };

  /*
   * FORMAT DATE
   */

  const formatDate = (
    date: string
  ) => {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">

          <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
            THARU Administration
          </p>

          <h1 className="mt-3 text-4xl font-light">
            Blog
          </h1>

        </div>

        <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading articles...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* HEADER */}

      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
            THARU Administration
          </p>

          <h1 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
            Blog
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
            Create and manage the stories, ideas and
            perspectives behind THARU.
          </p>

        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
        >
          + New Article
        </Link>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 p-6">

          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
            Total Articles
          </p>

          <p className="mt-4 text-3xl font-light">
            {posts.length}
          </p>

        </div>

        <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 p-6">

          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
            Published
          </p>

          <p className="mt-4 text-3xl font-light">
            {
              posts.filter(
                (post) => post.published
              ).length
            }
          </p>

        </div>

        <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 p-6">

          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
            Drafts
          </p>

          <p className="mt-4 text-3xl font-light">
            {
              posts.filter(
                (post) => !post.published
              ).length
            }
          </p>

        </div>

      </div>

      {/* EMPTY STATE */}

      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 px-6 py-20 text-center">

          <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
            THARU Journal
          </p>

          <h2 className="mt-4 text-2xl font-light">
            No articles yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            Your first article will appear here once
            you create it.
          </p>

          <Link
            href="/admin/blog/new"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
          >
            Create First Article
          </Link>

        </div>
      ) : (

        /* ARTICLES */

        <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-950">

          {/* DESKTOP HEADER */}

          <div className="hidden grid-cols-[1fr_140px_140px_120px] gap-4 border-b border-neutral-800 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-neutral-600 md:grid">

            <span>Article</span>
            <span>Category</span>
            <span>Date</span>
            <span>Status</span>

          </div>

          {posts.map((post) => (

            <div
              key={post.id}
              className="border-b border-neutral-800 px-5 py-6 last:border-b-0 md:px-6"
            >

              <div className="grid gap-5 md:grid-cols-[1fr_140px_140px_120px] md:items-center md:gap-4">

                {/* ARTICLE */}

                <div className="min-w-0">

                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="block truncate text-lg font-light transition hover:text-neutral-400"
                  >
                    {post.title}
                  </Link>

                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                      {post.excerpt}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-neutral-700">
                    /blog/{post.slug}
                  </p>

                </div>

                {/* CATEGORY */}

                <div>

                  <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600 md:hidden">
                    Category
                  </p>

                  <p className="mt-1 text-sm text-neutral-400 md:mt-0">
                    {post.category ||
                      "Uncategorized"}
                  </p>

                </div>

                {/* DATE */}

                <div>

                  <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600 md:hidden">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-neutral-400 md:mt-0">
                    {formatDate(
                      post.created_at
                    )}
                  </p>

                </div>

                {/* STATUS */}

                <div>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${
                      post.published
                        ? "border-neutral-600 text-white"
                        : "border-neutral-800 text-neutral-600"
                    }`}
                  >
                    {post.published
                      ? "Published"
                      : "Draft"}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex items-center gap-4 border-t border-neutral-900 pt-5">

                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-xs uppercase tracking-[0.15em] text-neutral-500 transition hover:text-white"
                >
                  Edit
                </Link>

                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs uppercase tracking-[0.15em] text-neutral-500 transition hover:text-white"
                  >
                    View
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      post.id,
                      post.title
                    )
                  }
                  className="text-xs uppercase tracking-[0.15em] text-neutral-600 transition hover:text-red-400"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}