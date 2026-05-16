"use client";

import { useCart } from "@/components/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      }
      className="rounded-full bg-white px-8 py-3 text-black transition hover:bg-neutral-200"
    >

      Add To Cart

    </button>
  );
}