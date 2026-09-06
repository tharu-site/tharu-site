"use client";

import {
  ChangeEvent,
  FormEvent,
  use,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditBlogPostPage({
  params,
}: PageProps) {
  const { id } = use(params);

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [author, setAuthor] =
    useState("THARU");

  const [coverImageUrl, setCoverImageUrl] =
    useState("");

  const [coverImageFile, setCoverImageFile] =
    useState<File | null>(null);

  const [coverImagePreview, setCoverImagePreview] =
    useState("");

  const [content, setContent] =
    useState("");

  const [published, setPublished] =
    useState(false);

  /*
   * LOAD ARTICLE
   */

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError("");

      const {
        data,
        error: postError,
      } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, content, cover_image_url, category, author, published, published_at"
        )
        .eq("id", id)
        .maybeSingle();

      if (postError) {
        console.error(
          "Blog post loading error:",
          postError
        );

        setError(
          postError.message ||
            "Unable to load article."
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "Article could not be found."
        );

        setLoading(false);
        return;
      }

      const post =
        data as BlogPost;

      setTitle(post.title || "");
      setSlug(post.slug || "");
      setExcerpt(post.excerpt || "");
      setCategory(post.category || "");
      setAuthor(post.author || "THARU");

      setCoverImageUrl(
        post.cover_image_url || ""
      );

      setContent(post.content || "");

      setPublished(
        Boolean(post.published)
      );

      setLoading(false);
    };

    loadPost();
  }, [id]);

  /*
   * CREATE SLUG
   */

  const createSlug = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /*
   * SELECT IMAGE
   */

  const handleImageSelect = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5MB."
      );
      return;
    }

    setCoverImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setCoverImagePreview(
      previewUrl
    );
  };

  /*
   * UPLOAD IMAGE
   */

  const uploadCoverImage = async () => {
    if (!coverImageFile) {
      return null;
    }

    setUploadingImage(true);
    setError("");

    try {
      const extension =
        coverImageFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const filePath =
        `posts/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("blog-images")
        .upload(
          filePath,
          coverImageFile,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "Blog image upload error:",
          uploadError
        );

        setError(
          uploadError.message ||
            "Unable to upload image."
        );

        return null;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        path: filePath,
      };

    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setError(
        "Unable to upload image."
      );

      return null;

    } finally {
      setUploadingImage(false);
    }
  };

  /*
   * GET STORAGE PATH
   *
   * Used later to remove
   * old uploaded images.
   */

  const getStoragePathFromUrl = (
    url: string
  ) => {
    const marker =
      "/storage/v1/object/public/blog-images/";

    const index =
      url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return url
      .slice(
        index + marker.length
      )
      .split("?")[0];
  };

  /*
   * SAVE CHANGES
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError(
        "Please enter an article title."
      );
      return;
    }

    if (!slug.trim()) {
      setError(
        "Please enter a slug."
      );
      return;
    }

    if (!content.trim()) {
      setError(
        "Please write some article content."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * CHECK SLUG
       */

      const {
        data: existingPost,
        error: slugError,
      } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug.trim())
        .neq("id", id)
        .maybeSingle();

      if (slugError) {
        console.error(
          "Slug check error:",
          slugError
        );

        setError(
          slugError.message ||
            "Unable to check article slug."
        );

        setSaving(false);
        return;
      }

      if (existingPost) {
        setError(
          "Another article already uses this slug."
        );

        setSaving(false);
        return;
      }

      /*
       * KEEP CURRENT IMAGE
       */

      let finalCoverImageUrl =
        coverImageUrl.trim() || null;

      let newlyUploadedPath:
        | string
        | null = null;

      /*
       * UPLOAD NEW IMAGE
       */

      if (coverImageFile) {
        const uploaded =
          await uploadCoverImage();

        if (!uploaded) {
          setSaving(false);
          return;
        }

        finalCoverImageUrl =
          uploaded.url;

        newlyUploadedPath =
          uploaded.path;
      }

      /*
       * UPDATE ARTICLE
       */

      const {
        data,
        error: updateError,
      } = await supabase
        .from("blog_posts")
        .update({
          title: title.trim(),

          slug: slug.trim(),

          excerpt:
            excerpt.trim() || null,

          category:
            category.trim() || null,

          author:
            author.trim() || "THARU",

          cover_image_url:
            finalCoverImageUrl,

          content:
            content.trim(),

          published,

          published_at: published
            ? new Date().toISOString()
            : null,
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error(
          "Blog update error:",
          updateError
        );

        /*
         * If the database update fails after
         * uploading a new image, remove the
         * newly uploaded image so we don't
         * leave an orphaned file.
         */

        if (newlyUploadedPath) {
          await supabase.storage
            .from("blog-images")
            .remove([
              newlyUploadedPath,
            ]);
        }

        setError(
          updateError.message ||
            "Unable to save article."
        );

        setSaving(false);
        return;
      }

      if (!data) {
        setError(
          "Article was not updated."
        );

        setSaving(false);
        return;
      }

      /*
       * DELETE OLD IMAGE
       *
       * Only after the database update
       * succeeds.
       */

      if (
        coverImageFile &&
        coverImageUrl
      ) {
        const oldPath =
          getStoragePathFromUrl(
            coverImageUrl
          );

        if (oldPath) {
          await supabase.storage
            .from("blog-images")
            .remove([oldPath]);
        }
      }

      /*
       * SUCCESS
       */

      router.push("/admin/blog");
      router.refresh();

    } catch (error) {
      console.error(
        "Save article error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

      setSaving(false);
    }
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">

          <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
            THARU Administration
          </p>

          <h1 className="mt-3 text-4xl font-light">
            Edit Article
          </h1>

        </div>

        <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading article...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      {/* HEADER */}

      <div className="mb-10">

        <Link
          href="/admin/blog"
          className="text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:text-white"
        >
          ← Back to Blog
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-500">
          THARU Administration
        </p>

        <h1 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
          Edit Article
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          Update your THARU blog article.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC INFORMATION */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
              Article
            </p>

            <h2 className="mt-2 text-xl font-light">
              Basic Information
            </h2>

          </div>

          <div className="space-y-6">

            {/* TITLE */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className="h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition focus:border-white"
              />

            </div>

            {/* SLUG */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Slug
              </label>

              <div className="flex items-center rounded-2xl border border-neutral-800 bg-black">

                <span className="pl-5 text-sm text-neutral-700">
                  /blog/
                </span>

                <input
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      createSlug(
                        event.target.value
                      )
                    )
                  }
                  className="h-14 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none"
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                placeholder="Design"
                className="h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
              />

            </div>

            {/* AUTHOR */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Author
              </label>

              <input
                type="text"
                value={author}
                onChange={(event) =>
                  setAuthor(
                    event.target.value
                  )
                }
                className="h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition focus:border-white"
              />

            </div>

            {/* EXCERPT */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Excerpt
              </label>

              <textarea
                value={excerpt}
                onChange={(event) =>
                  setExcerpt(
                    event.target.value
                  )
                }
                rows={4}
                className="w-full resize-none rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm leading-relaxed text-white outline-none transition focus:border-white"
              />

            </div>

          </div>

        </section>

        {/* COVER IMAGE */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
              Visual
            </p>

            <h2 className="mt-2 text-xl font-light">
              Cover Image
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Upload a new image or keep the
              existing one.
            </p>

          </div>

          {/* CURRENT IMAGE */}

          {coverImageUrl &&
            !coverImagePreview && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-neutral-800">

                <img
                  src={coverImageUrl}
                  alt="Current cover"
                  className="max-h-[450px] w-full object-cover"
                />

              </div>
            )}

          {/* NEW PREVIEW */}

          {coverImagePreview && (
            <div className="mb-5 overflow-hidden rounded-2xl border border-white/20">

              <img
                src={coverImagePreview}
                alt="New cover preview"
                className="max-h-[450px] w-full object-cover"
              />

            </div>
          )}

          {/* FILE UPLOAD */}

          <label
            htmlFor="cover-image"
            className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-black px-6 py-8 text-center transition hover:border-neutral-400"
          >

            <div className="text-sm text-neutral-300">
              {coverImageFile
                ? coverImageFile.name
                : "Choose a new image"}
            </div>

            <div className="mt-2 text-xs text-neutral-600">
              JPG, PNG, WEBP · Maximum 5MB
            </div>

            <span className="mt-5 rounded-full border border-neutral-700 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Browse Files
            </span>

          </label>

          <input
            id="cover-image"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* OR */}

          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-neutral-800" />

            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              OR
            </span>

            <div className="h-px flex-1 bg-neutral-800" />

          </div>

          {/* URL */}

          <input
            type="url"
            value={
              coverImageFile
                ? ""
                : coverImageUrl
            }
            onChange={(event) => {
              setCoverImageUrl(
                event.target.value
              );

              setCoverImageFile(null);
              setCoverImagePreview("");
            }}
            placeholder="Paste an external image URL..."
            className="h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
          />

        </section>

        {/* CONTENT */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
              Story
            </p>

            <h2 className="mt-2 text-xl font-light">
              Article Content
            </h2>

          </div>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            rows={20}
            className="w-full resize-y rounded-2xl border border-neutral-800 bg-black px-5 py-5 text-sm leading-7 text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
          />

        </section>

        {/* PUBLISHING */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                Publishing
              </p>

              <h2 className="mt-2 text-xl font-light">
                Article Status
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Published articles are visible
                to customers.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setPublished(
                  !published
                )
              }
              className={`relative h-8 w-14 rounded-full transition ${
                published
                  ? "bg-white"
                  : "bg-neutral-800"
              }`}
            >

              <span
                className={`absolute top-1 h-6 w-6 rounded-full transition ${
                  published
                    ? "left-7 bg-black"
                    : "left-1 bg-neutral-500"
                }`}
              />

            </button>

          </div>

          <div className="mt-8 flex items-center gap-3">

            <div
              className={`h-2 w-2 rounded-full ${
                published
                  ? "bg-white"
                  : "bg-neutral-600"
              }`}
            />

            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              {published
                ? "Published"
                : "Draft"}
            </span>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row sm:justify-end">

          <Link
            href="/admin/blog"
            className="inline-flex h-14 items-center justify-center rounded-full border border-neutral-800 px-7 text-xs uppercase tracking-[0.2em] text-neutral-400 transition hover:border-white hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving ||
              uploadingImage
            }
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingImage
              ? "Uploading Image..."
              : saving
              ? "Saving..."
              : published
              ? "Save & Publish"
              : "Save Draft"}
          </button>

        </div>

      </form>

    </div>
  );
}