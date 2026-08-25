"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [blackImage, setBlackImage] = useState("");
  const [brownImage, setBrownImage] = useState("");

  const [blackPreview, setBlackPreview] = useState("");
  const [brownPreview, setBrownPreview] = useState("");

  const [caseDiameter, setCaseDiameter] = useState("");
  const [caseHeight, setCaseHeight] = useState("");
  const [lugToLug, setLugToLug] = useState("");
  const [crystal, setCrystal] = useState("");
  const [caseMaterial, setCaseMaterial] = useState("");
  const [movement, setMovement] = useState("");
  const [waterResistance, setWaterResistance] = useState("");
  const [strapWidth, setStrapWidth] = useState("");
  const [strapMaterial, setStrapMaterial] = useState("");

  const [uploadingBlack, setUploadingBlack] = useState(false);
  const [uploadingBrown, setUploadingBrown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * UPLOAD IMAGE
   */

  const uploadImage = async (
    file: File,
    type: "black" | "brown"
  ) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");

    if (type === "black") {
      setUploadingBlack(true);
    } else {
      setUploadingBrown(true);
    }

    try {
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

      const filePath =
        `products/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

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

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData.publicUrl;

      if (type === "black") {
        setBlackImage(publicUrl);
        setBlackPreview(publicUrl);
      } else {
        setBrownImage(publicUrl);
        setBrownPreview(publicUrl);
      }

    } catch (error) {
      console.error(
        "Unexpected image upload error:",
        error
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
   * CREATE PRODUCT
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

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

    if (!price || Number(price) < 0) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (!stock || Number(stock) < 0) {
      setError(
        "Please enter valid stock."
      );
      return;
    }

    setLoading(true);

    const {
      error: insertError,
    } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        short_description:
          shortDescription.trim(),
        description:
          description.trim(),
        price: Number(price),
        stock: Number(stock),

        black_image: blackImage,
        brown_image: brownImage,

        case_diameter:
          caseDiameter.trim() || null,

        case_height:
          caseHeight.trim() || null,

        lug_to_lug:
          lugToLug.trim() || null,

        crystal:
          crystal.trim() || null,

        case_material:
          caseMaterial.trim() || null,

        movement:
          movement.trim() || null,

        water_resistance:
          waterResistance.trim() || null,

        strap_width:
          strapWidth.trim() || null,

        strap_material:
          strapMaterial.trim() || null,
      });

    if (insertError) {
      console.error(
        "Create product error:",
        insertError
      );

      setError(
        insertError.message ||
          "Unable to create product."
      );

      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  /*
   * STYLES
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
          Add Product
        </h1>

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

            <div className="md:col-span-2">

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Product Name
              </label>

              <input
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Originis Noctis"
                className={inputClass}
              />

            </div>

            <div>

              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                Slug
              </label>

              <input
                required
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value)
                }
                placeholder="originis-noctis"
                className={inputClass}
              />

            </div>

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
                  setPrice(e.target.value)
                }
                placeholder="90000"
                className={inputClass}
              />

            </div>

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
                  setStock(e.target.value)
                }
                placeholder="50"
                className={inputClass}
              />

            </div>

          </div>

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
              placeholder="A refined expression of balance..."
              className={inputClass}
            />

          </div>

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
              placeholder="Describe the product..."
              className={textareaClass}
            />

          </div>

        </section>

        {/* IMAGES */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <h2 className="text-xl font-light">
            Product Images
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Upload the product images directly from your device.
            Maximum file size: 5MB.
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
                  disabled={uploadingBlack}
                  onChange={(event) => {

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

                    <div className="relative">

                      <div className="relative h-72">

                        <img
                          src={blackPreview}
                          alt="Black strap preview"
                          className="h-full w-full object-contain"
                        />

                      </div>

                      <div className="border-t border-neutral-800 px-5 py-4 text-center">

                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                          Click to replace image
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
                  disabled={uploadingBrown}
                  onChange={(event) => {

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

                    <div className="relative">

                      <div className="relative h-72">

                        <img
                          src={brownPreview}
                          alt="Brown strap preview"
                          className="h-full w-full object-contain"
                        />

                      </div>

                      <div className="border-t border-neutral-800 px-5 py-4 text-center">

                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                          Click to replace image
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

        {/* SPECIFICATIONS */}

        <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

          <h2 className="text-xl font-light">
            Technical Specifications
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {[
              {
                label: "Case Diameter",
                value: caseDiameter,
                setter: setCaseDiameter,
                placeholder: "40mm",
              },
              {
                label: "Case Height",
                value: caseHeight,
                setter: setCaseHeight,
                placeholder: "11mm",
              },
              {
                label: "Lug-to-Lug",
                value: lugToLug,
                setter: setLugToLug,
                placeholder: "47mm",
              },
              {
                label: "Crystal",
                value: crystal,
                setter: setCrystal,
                placeholder: "Mineral crystal",
              },
              {
                label: "Case Material",
                value: caseMaterial,
                setter: setCaseMaterial,
                placeholder: "Stainless steel",
              },
              {
                label: "Movement",
                value: movement,
                setter: setMovement,
                placeholder: "Quartz",
              },
              {
                label: "Water Resistance",
                value: waterResistance,
                setter: setWaterResistance,
                placeholder: "3ATM Resistance",
              },
              {
                label: "Strap Width",
                value: strapWidth,
                setter: setStrapWidth,
                placeholder: "20mm",
              },
              {
                label: "Strap Material",
                value: strapMaterial,
                setter: setStrapMaterial,
                placeholder: "Leather",
              },
            ].map((field) => (

              <div key={field.label}>

                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {field.label}
                </label>

                <input
                  value={field.value}
                  onChange={(e) =>
                    field.setter(
                      e.target.value
                    )
                  }
                  placeholder={
                    field.placeholder
                  }
                  className={inputClass}
                />

              </div>

            ))}

          </div>

        </section>

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
              loading ||
              uploadingBlack ||
              uploadingBrown
            }
            className="rounded-full bg-white px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Product"}
          </button>

        </div>

      </form>

    </div>
  );
}