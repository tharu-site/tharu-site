"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  stock: number;
  black_image: string | null;
  brown_image: string | null;
  case_diameter: string | null;
  case_height: string | null;
  lug_to_lug: string | null;
  crystal: string | null;
  case_material: string | null;
  movement: string | null;
  water_resistance: string | null;
  strap_width: string | null;
  strap_material: string | null;
  created_at: string;
  updated_at: string;
};

/*
 * GET STORAGE PATH FROM SUPABASE PUBLIC URL
 *
 * Example:
 *
 * https://xxxxx.supabase.co/storage/v1/object/public/
 * product-images/products/example.jpg
 *
 * becomes:
 *
 * products/example.jpg
 */

const getStoragePath = (
  publicUrl: string | null
) => {
  if (!publicUrl) return null;

  const marker =
    "/storage/v1/object/public/product-images/";

  const index =
    publicUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const path =
    publicUrl.slice(
      index + marker.length
    );

  if (!path.startsWith("products/")) {
    return null;
  }

  return decodeURIComponent(path);
};

/*
 * DELETE PRODUCT IMAGES FROM STORAGE
 */

const deleteProductImages = async (
  product: Product
) => {
  const paths = [
    getStoragePath(product.black_image),
    getStoragePath(product.brown_image),
  ].filter(
    (path): path is string =>
      Boolean(path)
  );

  /*
   * Remove duplicate paths if the same
   * image happens to be used twice.
   */

  const uniquePaths = [
    ...new Set(paths),
  ];

  if (uniquePaths.length === 0) {
    return {
      success: true,
    };
  }

  const {
    error,
  } = await supabase.storage
    .from("product-images")
    .remove(uniquePaths);

  if (error) {
    console.error(
      "Storage cleanup error:",
      error
    );

    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
  };
};

export default function ProductsAdminPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * LOAD PRODUCTS
   */

  useEffect(() => {
    const fetchProducts = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading products:",
          error
        );

        setError(
          "Unable to load products."
        );

        setLoading(false);

        return;
      }

      setProducts(data || []);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  /*
   * DELETE PRODUCT
   */

  const handleDelete = async (
    product: Product
  ) => {
    setError("");
    setSuccess("");

    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete "${product.name}"?\n\nThis will also remove its product images from storage.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);

    /*
     * STEP 1
     *
     * Remove product images from
     * Supabase Storage.
     */

    const storageResult =
      await deleteProductImages(
        product
      );

    if (!storageResult.success) {
      setError(
        "The product was not deleted because its images could not be removed from storage. Please try again."
      );

      setDeletingId(null);

      return;
    }

    /*
     * STEP 2
     *
     * Delete product from database.
     */

    const {
      error: deleteError,
    } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (deleteError) {
      console.error(
        "Delete product error:",
        deleteError
      );

      setError(
        "The product images were removed, but the product itself could not be deleted. Please try again."
      );

      setDeletingId(null);

      return;
    }

    /*
     * STEP 3
     *
     * Remove product from UI.
     */

    setProducts((prev) =>
      prev.filter(
        (item) =>
          item.id !== product.id
      )
    );

    setSuccess(
      `"${product.name}" was deleted successfully.`
    );

    setDeletingId(null);
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">

        <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
          Products
        </p>

        <h1 className="mt-3 text-4xl font-light">
          Products
        </h1>

        <div className="mt-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading products...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* HEADER */}

      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
            THARU Store
          </p>

          <h1 className="mt-3 text-4xl font-light md:text-5xl">
            Products
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Add, edit and manage your THARU products.
          </p>

        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
        >
          <Plus size={16} />

          Add Product
        </Link>

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

      {products.length === 0 && (
        <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-12 text-center">

          <h2 className="text-xl font-light">
            No products
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            Add your first THARU product.
          </p>

          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black"
          >
            Add Product
          </Link>

        </div>
      )}

      {/* PRODUCT LIST */}

      {products.length > 0 && (
        <div className="space-y-5">

          {products.map(
            (product) => (
              <article
                key={product.id}
                className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-5 md:p-7"
              >

                <div className="flex flex-col gap-6 md:flex-row md:items-center">

                  {/* IMAGE */}

                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-neutral-800 bg-black">

                    {product.black_image ? (

                      <img
                        src={
                          product.black_image
                        }
                        alt={
                          product.name
                        }
                        className="h-full w-full object-contain"
                      />

                    ) : (

                      <span className="text-xs text-neutral-700">
                        No image
                      </span>

                    )}

                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">

                    <h2 className="text-xl font-light">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                      {product.short_description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-6">

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                          Price
                        </p>

                        <p className="mt-1 text-sm">
                          ₦
                          {Number(
                            product.price
                          ).toLocaleString()}
                        </p>

                      </div>

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                          Stock
                        </p>

                        <p className="mt-1 text-sm">
                          {product.stock}
                        </p>

                      </div>

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                          Slug
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          {product.slug}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex shrink-0 gap-3">

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-3 text-xs uppercase tracking-[0.15em] transition hover:border-white"
                    >
                      <Pencil size={14} />

                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          product
                        )
                      }
                      disabled={
                        deletingId ===
                        product.id
                      }
                      className="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-3 text-xs uppercase tracking-[0.15em] text-neutral-500 transition hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <Trash2
                        size={14}
                      />

                      {deletingId ===
                      product.id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </div>
  );
}