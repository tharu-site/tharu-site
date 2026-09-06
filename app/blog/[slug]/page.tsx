import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

import { supabase } from "@/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image_url,
        category,
        author,
        published,
        published_at,
        created_at
      `
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as BlogPost;
}

async function getRelatedPosts(currentId: string) {
  const { data } = await supabase
    .from("blog_posts")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        category,
        published_at,
        created_at
      `
    )
    .eq("published", true)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(3);

  return data || [];
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id);
  const paragraphs = renderContent(post.content);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-5xl">

          {/* BACK TO BLOG */}
          <Link
            href="/blog"
            className="mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Blogs
          </Link>

          {/* META */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
            {post.category && (
              <span>{post.category}</span>
            )}

            {post.category && (
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
            )}

            <div className="flex items-center gap-2">
              <CalendarDays size={13} />
              {formatDate(post.published_at || post.created_at)}
            </div>
          </div>

          {/* TITLE */}
          <h1 className="max-w-4xl text-4xl font-light leading-[1.05] tracking-[-0.03em] md:text-6xl lg:text-7xl">
            {post.title}
          </h1>

          {/* EXCERPT */}
          {post.excerpt && (
            <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-400 md:text-lg md:leading-8">
              {post.excerpt}
            </p>
          )}

          {/* AUTHOR */}
          {post.author && (
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-neutral-500">
              By {post.author}
            </p>
          )}

        </div>
      </section>

      {/* COVER IMAGE */}
{post.cover_image_url && (
  <section className="px-6 md:px-10">
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl">
      <img
        src={post.cover_image_url}
        alt={post.title}
        className="h-[420px] w-full object-cover"
      />
    </div>
  </section>
)}

      {/* ARTICLE CONTENT */}
      <article className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">

          <div className="space-y-8 text-base leading-8 text-neutral-300 md:text-lg md:leading-9">

            {paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}

          </div>

        </div>
      </article>

      {/* DIVIDER */}
      <div className="mx-auto max-w-7xl border-t border-neutral-800" />

      {/* RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="px-6 py-20 md:px-10 md:py-28">

          <div className="mx-auto max-w-7xl">

            <div className="mb-12 flex items-end justify-between gap-6">

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Continue Reading
                </p>

                <h2 className="text-3xl font-light tracking-tight md:text-4xl">
                  From the Blog
                </h2>
              </div>

              <Link
                href="/blog"
                className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white md:flex"
              >
                View All
                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="grid gap-8 md:grid-cols-3">

              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group"
                >

                  {/* IMAGE */}
                  <div className="mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">

                    {related.cover_image_url ? (
                      <img
                        src={related.cover_image_url}
                        alt={related.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-neutral-600">
                        THARU
                      </div>
                    )}

                  </div>

                  {/* META */}
                  <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">

                    {related.category && (
                      <span>{related.category}</span>
                    )}

                    {related.category && (
                      <span className="h-1 w-1 rounded-full bg-neutral-600" />
                    )}

                    <span>
                      {formatDate(
                        related.published_at || related.created_at
                      )}
                    </span>

                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-light leading-snug text-white transition group-hover:text-neutral-400">
                    {related.title}
                  </h3>

                  {/* EXCERPT */}
                  {related.excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
                      {related.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500 transition group-hover:text-white">
                    Read Article
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>

                </Link>
              ))}

            </div>

            {/* MOBILE VIEW ALL */}
            <Link
              href="/blog"
              className="mt-12 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white md:hidden"
            >
              View All Blogs
              <ArrowRight size={15} />
            </Link>

          </div>

        </section>
      )}

    </main>
  );
}