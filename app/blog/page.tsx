"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
};

function formatDate(date: string | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
            id,
            title,
            slug,
            excerpt,
            cover_image_url,
            category,
            author,
            published_at,
            created_at
          `
        )
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error loading Blog posts:", error);
      } else {
        setPosts((data || []) as BlogPost[]);
      }

      setLoading(false);
    }

    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return posts;

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.author?.toLowerCase().includes(query)
      );
    });
  }, [posts, search]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* BLOG HEADER */}
      <section className="px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-500">
            THARU
          </p>

          <h1 className="text-5xl font-light tracking-[-0.04em] md:text-7xl">
            Blog
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-400 md:text-lg md:leading-8">
            Stories, ideas, and perspectives on watches, design,
            craftsmanship, and the world of THARU.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center rounded-full border border-neutral-700 bg-neutral-950 px-5 py-4 transition duration-300 focus-within:border-neutral-400">
            <Search
              size={20}
              className="mr-4 shrink-0 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">

          {/* RESULTS COUNT */}
          {!loading && (
            <div className="mb-10 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                {search
                  ? `${filteredPosts.length} ${
                      filteredPosts.length === 1
                        ? "Result"
                        : "Results"
                    }`
                  : `${posts.length} ${
                      posts.length === 1 ? "Article" : "Articles"
                    }`}
              </p>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="py-24 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-600">
                Loading Blog
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredPosts.length === 0 && (
            <div className="border-y border-neutral-800 py-24 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                No articles found
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 text-xs uppercase tracking-[0.2em] text-neutral-400 underline underline-offset-4 transition hover:text-white"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* ARTICLE GRID */}
          {!loading && filteredPosts.length > 0 && (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">

              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">

                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xs uppercase tracking-[0.3em] text-neutral-700">
                          THARU
                        </span>
                      </div>
                    )}

                    {/* HOVER ICON */}
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                      <ArrowUpRight size={16} />
                    </div>

                  </div>

                  {/* META */}
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">

                    {post.category && (
                      <span>{post.category}</span>
                    )}

                    {post.category && (
                      <span className="h-1 w-1 rounded-full bg-neutral-700" />
                    )}

                    <span>
                      {formatDate(
                        post.published_at || post.created_at
                      )}
                    </span>

                  </div>

                  {/* TITLE */}
                  <h2 className="mt-4 text-2xl font-light leading-snug tracking-[-0.02em] transition duration-300 group-hover:text-neutral-400">
                    {post.title}
                  </h2>

                  {/* EXCERPT */}
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
                      {post.excerpt}
                    </p>
                  )}

                  {/* AUTHOR */}
                  {post.author && (
                    <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                      By {post.author}
                    </p>
                  )}

                </Link>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}