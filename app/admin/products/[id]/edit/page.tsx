"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  stock: number;
  is_sold_out: boolean;

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
};

/*
 * GET STORAGE PATH FROM A SUPABASE PUBLIC URL
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
 * DELETE AN IMAGE FROM SUPABASE STORAGE
 */

const deleteStorageImage = async (
  publicUrl: string | null
) => {
  const path =
    getStoragePath(publicUrl);

  if (!path) return;

  const {
    error,
  } = await supabase.storage
    .from("product-images")
    .remove([path]);

  if (error) {
    console.error(
      "Storage image deletion error:",
      error
    );
  }
};

export default function EditProductPage() {
  const router = useRouter();

  const params = useParams();

  const productId =
    params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingBlack, setUploadingBlack] =
    useState(false);

  const [uploadingBrown, setUploadingBrown] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * BASIC INFORMATION
   */

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [shortDescription, setShortDescription] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  /*
   * MANUAL SOLD OUT STATUS
   */

  const [isSoldOut, setIsSoldOut] =
    useState(false);

  /*
   * IMAGES
   */

  const [blackImage, setBlackImage] =
    useState("");

  const [brownImage, setBrownImage] =
    useState("");

  const [blackPreview, setBlackPreview] =
    useState("");

  const [brownPreview, setBrownPreview] =
    useState("");

  /*
   * TECHNICAL SPECIFICATIONS
   */

  const [caseDiameter, setCaseDiameter] =
    useState("");

  const [caseHeight, setCaseHeight] =
    useState("");

  const [lugToLug, setLugToLug] =
    useState("");

  const [crystal, setCrystal] =
    useState("");

  const [caseMaterial, setCaseMaterial] =
    useState("");

  const [movement, setMovement] =
    useState("");

  const [waterResistance, setWaterResistance] =
    useState("");

  const [strapWidth, setStrapWidth] =
    useState("");

  const [strapMaterial, setStrapMaterial] =
    useState("");

  /*
   * ORIGINAL IMAGES
   *
   * Used to delete old images when
   * they are replaced.
   */

  const [originalBlackImage, setOriginalBlackImage] =
    useState<string | null>(null);

  const [originalBrownImage, setOriginalBrownImage] =
    useState<string | null>(null);

  /*
   * NEWLY UPLOADED IMAGES
   *
   * Used to clean up uploads if saving
   * the product fails.
   */

  const [newBlackImage, setNewBlackImage] =
    useState<string | null>(null);

  const [newBrownImage, setNewBrownImage] =
    useState<string | null>(null);

  /*
   * LOAD PRODUCT
   */

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError("");

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error(
          "Error loading product:",
          error
        );

        setError(
          "Unable to load this product."
        );

        setLoading(false);

        return;
      }

      /*
       * STORE PRODUCT
       */

      setProduct(data);

      /*
       * BASIC INFORMATION
       */

      setName(
        data.name || ""
      );

      setSlug(
        data.slug || ""
      );

      setShortDescription(
        data.short_description || ""
      );

      setDescription(
        data.description || ""
      );

      setPrice(
        String(data.price ?? "")
      );

      setStock(
        String(data.stock ?? "")
      );

      /*
       * LOAD MANUAL SOLD OUT STATUS
       */

      setIsSoldOut(
        Boolean(data.is_sold_out)
      );

      /*
       * IMAGES
       */

      setBlackImage(
        data.black_image || ""
      );

      setBrownImage(
        data.brown_image || ""
      );

      setBlackPreview(
        data.black_image || ""
      );

      setBrownPreview(
        data.brown_image || ""
      );

      /*
       * ORIGINAL IMAGES
       */

      setOriginalBlackImage(
        data.black_image || null
      );

      setOriginalBrownImage(
        data.brown_image || null
      );

      /*
       * TECHNICAL SPECIFICATIONS
       */

      setCaseDiameter(
        data.case_diameter || ""
      );

      setCaseHeight(
        data.case_height || ""
      );

      setLugToLug(
        data.lug_to_lug || ""
      );

      setCrystal(
        data.crystal || ""
      );

      setCaseMaterial(
        data.case_material || ""
      );

      setMovement(
        data.movement || ""
      );

      setWaterResistance(
        data.water_resistance || ""
      );

      setStrapWidth(
        data.strap_width || ""
      );

      setStrapMaterial(
        data.strap_material || ""
      );

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  /*
   * UPLOAD IMAGE
   */

  const uploadImage = async (
    file: File,
    type: "black" | "brown"
  ) => {
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

    setError("");
    setSuccess("");

    if (type === "black") {
      setUploadingBlack(true);
    } else {
      setUploadingBrown(true);
    }

    try {
      const fileExtension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

      const filePath =
        `products/${fileName}`;

      /*
       * UPLOAD
       */

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "Image upload error:",
          uploadError
        );

        setError(
          "Unable to upload image. Please try again."
        );

        return;
      }

      /*
       * GET PUBLIC URL
       */

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData.publicUrl;

      /*
       * UPDATE CORRECT IMAGE
       */

      if (type === "black") {
        setBlackImage(publicUrl);
        setBlackPreview(publicUrl);
        setNewBlackImage(publicUrl);
      } else {
        setBrownImage(publicUrl);
        setBrownPreview(publicUrl);
        setNewBrownImage(publicUrl);
      }

      setSuccess(
        `${
          type === "black"
            ? "Black"
            : "Brown"
        } strap image uploaded. Save changes to apply it.`
      );

    } catch (uploadError) {
      console.error(
        "Unexpected image upload error:",
        uploadError
      );

      setError(
        "Something went wrong while uploading the image."
      );

    } finally {
      if (type === "black") {
        setUploadingBlack(false);
      } else {
        setUploadingBrown(false);
      }
    }
  };

  /*
   * SAVE CHANGES
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * VALIDATION
     */

    if (!blackImage) {
      setError(
        "Please upload the black strap product image."
      );

      return;
    }

    if (!brownImage) {
      setError(
        "Please upload the brown strap product image."
      );

      return;
    }

    if (!name.trim()) {
      setError(
        "Please enter a product name."
      );

      return;
    }

    if (!slug.trim()) {
      setError(
        "Please enter a product slug."
      );

      return;
    }

    if (
      !price ||
      Number(price) < 0
    ) {
      setError(
        "Please enter a valid price."
      );

      return;
    }

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      setError(
        "Please enter valid stock."
      );

      return;
    }

    setSaving(true);

    /*
     * UPDATE PRODUCT
     */

    const {
      error: updateError,
    } = await supabase
      .from("products")
      .update({
        /*
         * BASIC INFORMATION
         */

        name:
          name.trim(),

        slug:
          slug.trim(),

        short_description:
          shortDescription.trim(),

        description:
          description.trim(),

        price:
          Number(price),

        stock:
          Number(stock),

        /*
         * MANUAL AVAILABILITY
         *
         * This is completely independent
         * of the stock number.
         */

        is_sold_out:
          isSoldOut,

        /*
         * IMAGES
         */

        black_image:
          blackImage,

        brown_image:
          brownImage,

        /*
         * TECHNICAL SPECIFICATIONS
         */

        case_diameter:
          caseDiameter.trim() ||
          null,

        case_height:
          caseHeight.trim() ||
          null,

        lug_to_lug:
          lugToLug.trim() ||
          null,

        crystal:
          crystal.trim() ||
          null,

        case_material:
          caseMaterial.trim() ||
          null,

        movement:
          movement.trim() ||
          null,

        water_resistance:
          waterResistance.trim() ||
          null,

        strap_width:
          strapWidth.trim() ||
          null,

        strap_material:
          strapMaterial.trim() ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        productId
      );

    /*
     * DATABASE UPDATE FAILED
     */

    if (updateError) {
      console.error(
        "Update product error:",
        updateError
      );

      /*
       * DELETE NEW UPLOADS
       * IF SAVE FAILED
       */

      if (
        newBlackImage &&
        newBlackImage !==
          originalBlackImage
      ) {
        await deleteStorageImage(
          newBlackImage
        );
      }

      if (
        newBrownImage &&
        newBrownImage !==
          originalBrownImage
      ) {
        await deleteStorageImage(
          newBrownImage
        );
      }

      setError(
        updateError.message ||
          "Unable to update product."
      );

      setSaving(false);

      return;
    }

    /*
     * DATABASE UPDATE SUCCEEDED
     *
     * DELETE OLD IMAGES IF REPLACED.
     */

    if (
      originalBlackImage &&
      blackImage !==
        originalBlackImage
    ) {
      await deleteStorageImage(
        originalBlackImage
      );
    }

    if (
      originalBrownImage &&
      brownImage !==
        originalBrownImage
    ) {
      await deleteStorageImage(
        originalBrownImage
      );
    }

    /*
     * SUCCESS
     */

    setSuccess(
      "Product updated successfully."
    );

    /*
     * RETURN TO PRODUCT LIST
     */

    setTimeout(() => {
      router.push(
        "/admin/products"
      );

      router.refresh();
    }, 700);
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">

        <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
          Products
        </p>

        <h1 className="mt-3 text-4xl font-light">
          Edit Product
        </h1>

        <div className="mt-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading product...
          </p>

        </div>

      </div>
    );
  }

  /*
   * PRODUCT NOT FOUND
   */

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl">

        <h1 className="text-4xl font-light">
          Product not found
        </h1>

        <Link
          href="/admin/products"
          className="mt-6 inline-flex rounded-full border border-neutral-800 px-6 py-3 text-xs uppercase tracking-[0.2em] transition hover:border-white"
        >
          Back to Products
        </Link>

      </div>
    );
  }

  /*
   * INPUT STYLES
   */

  const inputClass =
    "h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white";

  const textareaClass =
    "w-full resize-none rounded-[22px] border border-neutral-800 bg-black px-5 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-neutral-600 focus:border-white";

  return (
    <div className="mx-auto max-w-5xl">

      {/* HEADER */}

      <div className="mb-10">

        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:text-white"
        >
          ← Products
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Store
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-5xl">
          Edit Product
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          Update the details for{" "}
          {product.name}.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* BASIC INFORMATION */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <h2 className="text-xl font-light">
            Basic Information
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {/* PRODUCT NAME */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Product Name
              </label>

              <input
                required
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            {/* SLUG */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Slug
              </label>

              <input
                required
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            {/* PRICE */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Price (₦)
              </label>

              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            {/* STOCK */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Stock
              </label>

              <input
                required
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <p className="mt-2 text-xs text-neutral-600">
                Stock quantity is separate from the manual sold-out setting.
              </p>

            </div>

            {/* AVAILABILITY */}

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Availability
              </label>

              <button
                type="button"
                onClick={() =>
                  setIsSoldOut(
                    (current) =>
                      !current
                  )
                }
                className={`flex h-14 w-full items-center justify-between rounded-2xl border px-5 transition ${
                  isSoldOut
                    ? "border-red-900 bg-red-950/30"
                    : "border-emerald-900 bg-emerald-950/20"
                }`}
              >

                <div className="flex items-center gap-3">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isSoldOut
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                  />

                  <span className="text-sm">
                    {isSoldOut
                      ? "Sold Out"
                      : "Available"}
                  </span>

                </div>

                <span
                  className={`relative h-6 w-11 rounded-full transition ${
                    isSoldOut
                      ? "bg-red-900"
                      : "bg-emerald-900"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      isSoldOut
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </span>

              </button>

              <p className="mt-2 text-xs text-neutral-600">
                {isSoldOut
                  ? "Customers cannot purchase this product."
                  : "Customers can purchase this product."}
              </p>

            </div>

          </div>

          {/* SHORT DESCRIPTION */}

          <div className="mt-5">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
              Short Description
            </label>

            <input
              value={shortDescription}
              onChange={(e) =>
                setShortDescription(
                  e.target.value
                )
              }
              className={inputClass}
            />

          </div>

          {/* FULL DESCRIPTION */}

          <div className="mt-5">

            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
              Full Description
            </label>

            <textarea
              rows={7}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className={textareaClass}
            />

          </div>

        </section>

        {/* PRODUCT IMAGES */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <h2 className="text-xl font-light">
            Product Images
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Upload a new image to replace the current one.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* BLACK IMAGE */}

            <div>

              <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Black Strap Image
              </label>

              <label className="block cursor-pointer">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={
                    uploadingBlack
                  }
                  onChange={(
                    event
                  ) => {

                    const file =
                      event.target.files?.[0];

                    if (!file) return;

                    uploadImage(
                      file,
                      "black"
                    );

                  }}
                />

                <div className="overflow-hidden rounded-[24px] border border-dashed border-neutral-800 bg-black transition hover:border-neutral-500">

                  {blackPreview ? (

                    <div>

                      <div className="relative h-72">

                        <img
                          src={
                            blackPreview
                          }
                          alt="Black strap product"
                          className="h-full w-full object-contain"
                        />

                      </div>

                      <div className="border-t border-neutral-800 px-5 py-4 text-center">

                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">

                          {uploadingBlack
                            ? "Uploading..."
                            : "Click to replace image"}

                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="flex h-72 items-center justify-center">

                      <div className="text-center">

                        <p className="text-sm text-neutral-400">
                          {uploadingBlack
                            ? "Uploading..."
                            : "Choose Black Strap Image"}
                        </p>

                        <p className="mt-2 text-xs text-neutral-700">
                          PNG, JPG, WEBP
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              </label>

            </div>

            {/* BROWN IMAGE */}

            <div>

              <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Brown Strap Image
              </label>

              <label className="block cursor-pointer">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={
                    uploadingBrown
                  }
                  onChange={(
                    event
                  ) => {

                    const file =
                      event.target.files?.[0];

                    if (!file) return;

                    uploadImage(
                      file,
                      "brown"
                    );

                  }}
                />

                <div className="overflow-hidden rounded-[24px] border border-dashed border-neutral-800 bg-black transition hover:border-neutral-500">

                  {brownPreview ? (

                    <div>

                      <div className="relative h-72">

                        <img
                          src={
                            brownPreview
                          }
                          alt="Brown strap product"
                          className="h-full w-full object-contain"
                        />

                      </div>

                      <div className="border-t border-neutral-800 px-5 py-4 text-center">

                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">

                          {uploadingBrown
                            ? "Uploading..."
                            : "Click to replace image"}

                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="flex h-72 items-center justify-center">

                      <div className="text-center">

                        <p className="text-sm text-neutral-400">
                          {uploadingBrown
                            ? "Uploading..."
                            : "Choose Brown Strap Image"}
                        </p>

                        <p className="mt-2 text-xs text-neutral-700">
                          PNG, JPG, WEBP
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              </label>

            </div>

          </div>

        </section>

        {/* TECHNICAL SPECIFICATIONS */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <h2 className="text-xl font-light">
            Technical Specifications
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Case Diameter
              </label>

              <input
                value={caseDiameter}
                onChange={(e) =>
                  setCaseDiameter(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Case Height
              </label>

              <input
                value={caseHeight}
                onChange={(e) =>
                  setCaseHeight(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Lug-to-Lug
              </label>

              <input
                value={lugToLug}
                onChange={(e) =>
                  setLugToLug(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Crystal
              </label>

              <input
                value={crystal}
                onChange={(e) =>
                  setCrystal(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Case Material
              </label>

              <input
                value={caseMaterial}
                onChange={(e) =>
                  setCaseMaterial(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Movement
              </label>

              <input
                value={movement}
                onChange={(e) =>
                  setMovement(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Water Resistance
              </label>

              <input
                value={waterResistance}
                onChange={(e) =>
                  setWaterResistance(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Strap Width
              </label>

              <input
                value={strapWidth}
                onChange={(e) =>
                  setStrapWidth(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Strap Material
              </label>

              <input
                value={strapMaterial}
                onChange={(e) =>
                  setStrapMaterial(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

          </div>

        </section>

        {/* SUCCESS */}

        {success && (
          <div className="rounded-[20px] border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-300">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="rounded-[20px] border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-400">
            {error}
          </div>
        )}

        {/* ACTIONS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

          <Link
            href="/admin/products"
            className="rounded-full border border-neutral-800 px-7 py-4 text-center text-xs uppercase tracking-[0.2em] transition hover:border-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving ||
              uploadingBlack ||
              uploadingBrown
            }
            className="rounded-full bg-white px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}