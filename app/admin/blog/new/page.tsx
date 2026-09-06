"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function NewBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("THARU");

  const [coverImageUrl, setCoverImageUrl] =
    useState("");

  const [coverImageFile, setCoverImageFile] =
    useState<File | null>(null);

  const [coverImagePreview, setCoverImagePreview] =
    useState("");

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [content, setContent] = useState("");

  const [published, setPublished] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * CREATE SLUG
   */

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /*
   * TITLE CHANGE
   */

  const handleTitleChange = (
    value: string
  ) => {
    setTitle(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  };

  /*
   * SELECT IMAGE
   */

  const handleImageSelect = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    /*
     * VALIDATE TYPE
     */

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    /*
     * VALIDATE SIZE
     *
     * Maximum: 5MB
     */

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5MB."
      );
      return;
    }

    setCoverImageFile(file);

    /*
     * CREATE LOCAL PREVIEW
     */

    const previewUrl =
      URL.createObjectURL(file);

    setCoverImagePreview(previewUrl);

    /*
     * Clear pasted URL when
     * uploading a new image
     */

    setCoverImageUrl("");
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
      const fileExtension =
        coverImageFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

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

      return publicUrlData.publicUrl;

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
   * SAVE ARTICLE
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
      } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug.trim())
        .maybeSingle();

      if (existingPost) {
        setError(
          "An article with this slug already exists."
        );

        setSaving(false);
        return;
      }

      /*
       * UPLOAD COVER IMAGE
       */

      let finalCoverImageUrl =
        coverImageUrl.trim() || null;

      if (coverImageFile) {
        const uploadedUrl =
          await uploadCoverImage();

        if (!uploadedUrl) {
          setSaving(false);
          return;
        }

        finalCoverImageUrl =
          uploadedUrl;
      }

      /*
       * INSERT ARTICLE
       */

      const {
        error: insertError,
      } = await supabase
        .from("blog_posts")
        .insert({
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
        });

      if (insertError) {
        console.error(
          "Blog insert error:",
          insertError
        );

        setError(
          insertError.message ||
            "Unable to create article."
        );

        setSaving(false);
        return;
      }

      /*
       * SUCCESS
       */

      router.push("/admin/blog");
      router.refresh();

    } catch (error) {
      console.error(
        "Create article error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">

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
          New Article
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          Create a new story for the THARU blog.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* FORM */}

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
                  handleTitleChange(
                    event.target.value
                  )
                }
                placeholder="The story behind Originis"
                className="h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
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
                  placeholder="the-story-behind-originis"
                  className="h-14 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-neutral-700"
                />

              </div>

              <p className="mt-2 text-xs text-neutral-700">
                This becomes the article URL.
              </p>

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
                placeholder="A short introduction to the article..."
                className="w-full resize-none rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
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
              Upload an image from your device or
              paste an external image URL.
            </p>

          </div>

          {/* FILE UPLOAD */}

          <label
            htmlFor="cover-image"
            className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-black px-6 py-8 text-center transition hover:border-neutral-400"
          >

            <div className="text-sm text-neutral-300">
              {coverImageFile
                ? coverImageFile.name
                : "Choose an image"}
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

          {/* PREVIEW */}

          {coverImagePreview && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-800">

              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="max-h-[450px] w-full object-cover"
              />

            </div>
          )}

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
            value={coverImageUrl}
            onChange={(event) => {
              setCoverImageUrl(
                event.target.value
              );

              if (event.target.value) {
                setCoverImageFile(null);
                setCoverImagePreview("");
              }
            }}
            placeholder="https://..."
            className="h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
          />

          <p className="mt-3 text-xs leading-relaxed text-neutral-700">
            Uploaded images are stored in Supabase
            Storage under blog-images/posts/.
          </p>

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
            placeholder="Write your article here..."
            className="w-full resize-y rounded-2xl border border-neutral-800 bg-black px-5 py-5 text-sm leading-7 text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
          />

          <p className="mt-3 text-xs leading-relaxed text-neutral-700">
            Rich text formatting can be added later.
          </p>

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
                Drafts remain hidden from customers.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setPublished(!published)
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
                ? "Ready to publish"
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
              ? "Publish Article"
              : "Save Draft"}
          </button>

        </div>

      </form>

    </div>
  );
}