"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Package,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string | null;
  state: string;
  country: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: string;
  order_status: string;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
};

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [items, setItems] =
    useState<OrderItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * LOAD ORDER
   */

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      setError("");

      const {
        data: orderData,
        error: orderError,
      } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) {
        console.error(
          "Error loading order:",
          orderError
        );

        setError(
          "Unable to load this order."
        );

        setLoading(false);
        return;
      }

      const {
        data: itemData,
        error: itemError,
      } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId)
        .order("id", {
          ascending: true,
        });

      if (itemError) {
        console.error(
          "Error loading order items:",
          itemError
        );

        setError(
          "Unable to load the order items."
        );

        setLoading(false);
        return;
      }

      setOrder(orderData);
      setItems(itemData || []);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  /*
   * UPDATE ORDER STATUS
   */

  const updateOrderStatus = async (
    status: string
  ) => {
    if (!order) return;

    setSaving(true);
    setError("");

    const {
      error: updateError,
    } = await supabase
      .from("orders")
      .update({
        order_status: status,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error(
        "Update order status error:",
        updateError
      );

      setError(
        "Unable to update order status."
      );

      setSaving(false);
      return;
    }

    setOrder((current) =>
      current
        ? {
            ...current,
            order_status: status,
            updated_at:
              new Date().toISOString(),
          }
        : current
    );

    setSaving(false);
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
      "en-NG",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /*
   * FORMAT TIME
   */

  const formatTime = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleTimeString(
      "en-NG",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /*
   * FORMAT MONEY
   */

  const formatMoney = (
    amount: number
  ) => {
    return `₦${Number(
      amount
    ).toLocaleString()}`;
  };

  /*
   * PAYMENT STATUS
   */

  const paymentStatusClass =
    (status: string) => {
      switch (status) {
        case "paid":
          return "border-emerald-900 bg-emerald-950/40 text-emerald-400";

        case "failed":
          return "border-red-900 bg-red-950/40 text-red-400";

        case "refunded":
          return "border-amber-900 bg-amber-950/40 text-amber-400";

        default:
          return "border-neutral-800 bg-neutral-900 text-neutral-500";
      }
    };

  /*
   * ORDER STATUS
   */

  const orderStatusClass =
    (status: string) => {
      switch (status) {
        case "processing":
          return "border-blue-900 bg-blue-950/40 text-blue-400";

        case "shipped":
          return "border-purple-900 bg-purple-950/40 text-purple-400";

        case "delivered":
          return "border-emerald-900 bg-emerald-950/40 text-emerald-400";

        case "cancelled":
          return "border-red-900 bg-red-950/40 text-red-400";

        default:
          return "border-neutral-800 bg-neutral-900 text-neutral-500";
      }
    };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          Orders
        </p>

        <h1 className="mt-3 text-4xl font-light">
          Order Details
        </h1>

        <div className="mt-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading order...
          </p>

        </div>

      </div>
    );
  }

  /*
   * ORDER NOT FOUND
   */

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl">

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:text-white"
        >
          <ArrowLeft size={14} />

          Orders
        </Link>

        <h1 className="mt-8 text-4xl font-light">
          Order not found
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          This order may have been deleted
          or does not exist.
        </p>

      </div>
    );
  }

  /*
   * PAGE
   */

  return (
    <div className="mx-auto max-w-6xl">

      {/* HEADER */}

      <div className="mb-10">

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:text-white"
        >
          <ArrowLeft size={14} />

          Orders
        </Link>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
              THARU Store
            </p>

            <h1 className="mt-3 text-4xl font-light md:text-5xl">
              {order.order_number}
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              Placed{" "}
              {formatDate(
                order.created_at
              )}{" "}
              at{" "}
              {formatTime(
                order.created_at
              )}
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <span
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.15em] ${paymentStatusClass(
                order.payment_status
              )}`}
            >
              Payment:{" "}
              {order.payment_status}
            </span>

            <span
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.15em] ${orderStatusClass(
                order.order_status
              )}`}
            >
              {order.order_status}
            </span>

          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-8 rounded-[20px] border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-400">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

        {/* LEFT */}

        <div className="space-y-8">

          {/* ORDER ITEMS */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            <div className="flex items-center gap-3">

              <Package
                size={18}
                className="text-neutral-500"
              />

              <h2 className="text-xl font-light">
                Order Items
              </h2>

            </div>

            <div className="mt-8 divide-y divide-neutral-900">

              {items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 py-6 first:pt-0 last:pb-0"
                  >

                    {/* IMAGE */}

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-neutral-800 bg-black">

                      {item.image_url ? (
                        <img
                          src={
                            item.image_url
                          }
                          alt={
                            item.product_name
                          }
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.1em] text-neutral-700">
                          No image
                        </span>
                      )}

                    </div>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">

                      <h3 className="text-base">
                        {item.product_name}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-500">
                        Qty:{" "}
                        {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        {formatMoney(
                          item.unit_price
                        )}{" "}
                        each
                      </p>

                    </div>

                    {/* TOTAL */}

                    <p className="shrink-0 text-sm">
                      {formatMoney(
                        item.total_price
                      )}
                    </p>

                  </div>
                )
              )}

            </div>

          </section>

          {/* CUSTOMER */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            <h2 className="text-xl font-light">
              Customer Information
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Name
                </p>

                <p className="mt-2 text-sm">
                  {order.first_name}{" "}
                  {order.last_name}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Email
                </p>

                <p className="mt-2 break-all text-sm">
                  {order.customer_email}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Phone
                </p>

                <p className="mt-2 text-sm">
                  {order.phone}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Country
                </p>

                <p className="mt-2 text-sm">
                  {order.country ||
                    "Nigeria"}
                </p>
              </div>

              <div className="md:col-span-2">

                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Delivery Address
                </p>

                <p className="mt-2 text-sm leading-relaxed">
                  {order.address}
                  <br />

                  {order.city
                    ? `${order.city}, `
                    : ""}

                  {order.state}
                  <br />

                  {order.country ||
                    "Nigeria"}
                </p>

              </div>

            </div>

          </section>

          {/* PAYMENT */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            <h2 className="text-xl font-light">
              Payment Information
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Payment Status
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.15em] ${paymentStatusClass(
                    order.payment_status
                  )}`}
                >
                  {order.payment_status}
                </span>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  Paystack Reference
                </p>

                <p className="mt-3 break-all text-sm text-neutral-400">
                  {order.payment_reference ||
                    "Not available"}
                </p>

              </div>

            </div>

          </section>

        </div>

        {/* RIGHT */}

        <div className="space-y-8">

          {/* STATUS MANAGEMENT */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6">

            <div className="flex items-center gap-3">

              <Truck
                size={18}
                className="text-neutral-500"
              />

              <h2 className="text-xl font-light">
                Order Status
              </h2>

            </div>

            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Update the order as it moves
              through fulfillment.
            </p>

            <div className="mt-6 space-y-2">

              {orderStatuses.map(
                (status) => {

                  const active =
                    order.order_status ===
                    status;

                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={
                        saving ||
                        active
                      }
                      onClick={() =>
                        updateOrderStatus(
                          status
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-xs uppercase tracking-[0.15em] transition ${
                        active
                          ? "border-white bg-white text-black"
                          : "border-neutral-800 text-neutral-500 hover:border-neutral-500 hover:text-white"
                      } disabled:cursor-not-allowed`}
                    >

                      <span>
                        {status}
                      </span>

                      {active && (
                        <Check
                          size={16}
                        />
                      )}

                    </button>
                  );
                }
              )}

            </div>

          </section>

          {/* ORDER SUMMARY */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6">

            <h2 className="text-xl font-light">
              Order Summary
            </h2>

            <div className="mt-7 space-y-4">

              <div className="flex justify-between text-sm">

                <span className="text-neutral-500">
                  Subtotal
                </span>

                <span>
                  {formatMoney(
                    order.subtotal
                  )}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-neutral-500">
                  Delivery
                </span>

                <span>
                  {formatMoney(
                    order.delivery_fee
                  )}
                </span>

              </div>

              <div className="border-t border-neutral-800 pt-5">

                <div className="flex justify-between">

                  <span className="text-base">
                    Total
                  </span>

                  <span className="text-xl">
                    {formatMoney(
                      order.total
                    )}
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}