"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Eye,
  Package,
  RefreshCw,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export default function OrdersAdminPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * LOAD ORDERS
   */

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            customer_email,
            first_name,
            last_name,
            total,
            payment_status,
            order_status,
            created_at
          `
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "ADMIN ORDERS ERROR:",
          error
        );

        setError(
          `${error.message} (${error.code || "unknown"})`
        );

        setOrders([]);

        return;
      }

      console.log(
        "ADMIN ORDERS LOADED:",
        data
      );

      setOrders(
        (data as Order[]) || []
      );
    } catch (err) {
      console.error(
        "ADMIN ORDERS EXCEPTION:",
        err
      );

      setError(
        "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * INITIAL LOAD
   */

  useEffect(() => {
    fetchOrders();
  }, []);

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
        month: "short",
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
   * PAYMENT STATUS
   */

  const paymentStatusClass = (
    status: string
  ) => {
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

  const orderStatusClass = (
    status: string
  ) => {
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
      <div className="mx-auto max-w-7xl">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Store
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-5xl">
          Orders
        </h1>

        <div className="mt-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading orders...
          </p>

        </div>

      </div>
    );
  }

  /*
   * PAGE
   */

  return (
    <div className="mx-auto max-w-7xl">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Store
        </p>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <h1 className="text-4xl font-light md:text-5xl">
              Orders
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              View and manage customer orders.
            </p>

          </div>

          <button
            onClick={fetchOrders}
            className="flex w-fit items-center gap-3 rounded-full border border-neutral-800 bg-neutral-950 px-5 py-3 text-xs uppercase tracking-[0.2em] text-neutral-400 transition hover:border-white hover:text-white"
          >
            <RefreshCw
              size={15}
            />

            Refresh

            <span>
              {orders.length}
            </span>
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-8 rounded-[20px] border border-red-900 bg-red-950/30 p-5">

          <p className="text-xs uppercase tracking-[0.2em] text-red-400">
            Unable to load orders
          </p>

          <p className="mt-3 text-sm text-neutral-400">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-5 rounded-full border border-neutral-700 px-5 py-2 text-xs uppercase tracking-[0.15em] transition hover:border-white"
          >
            Try Again
          </button>

        </div>
      )}

      {/* EMPTY */}

      {!error &&
        orders.length === 0 && (
          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800">

              <Package
                size={24}
                className="text-neutral-600"
              />

            </div>

            <h2 className="mt-6 text-xl font-light">
              No orders yet
            </h2>

            <p className="mt-3 text-sm text-neutral-500">
              Customer orders will appear
              here after successful payment.
            </p>

          </div>
        )}

      {/* DESKTOP TABLE */}

      {orders.length > 0 && (
        <div className="hidden overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-950 md:block">

          {/* TABLE HEADER */}

          <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_80px] gap-5 border-b border-neutral-800 px-7 py-5">

            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              Order
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              Customer
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              Total
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              Payment
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              Status
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              View
            </p>

          </div>

          {/* ORDERS */}

          {orders.map(
            (order) => (
              <div
                key={order.id}
                className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_80px] items-center gap-5 border-b border-neutral-900 px-7 py-6 last:border-b-0"
              >

                {/* ORDER */}

                <div>

                  <p className="text-sm text-white">
                    {order.order_number}
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">
                    {formatDate(
                      order.created_at
                    )}
                  </p>

                  <p className="text-xs text-neutral-700">
                    {formatTime(
                      order.created_at
                    )}
                  </p>

                </div>

                {/* CUSTOMER */}

                <div className="min-w-0">

                  <p className="truncate text-sm">
                    {order.first_name}{" "}
                    {order.last_name}
                  </p>

                  <p className="mt-1 truncate text-xs text-neutral-600">
                    {order.customer_email}
                  </p>

                </div>

                {/* TOTAL */}

                <p className="text-sm">
                  ₦
                  {Number(
                    order.total
                  ).toLocaleString()}
                </p>

                {/* PAYMENT */}

                <div>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${paymentStatusClass(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status}
                  </span>

                </div>

                {/* STATUS */}

                <div>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${orderStatusClass(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>

                </div>

                {/* VIEW */}

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 transition hover:border-white hover:bg-white hover:text-black"
                >

                  <Eye size={16} />

                </Link>

              </div>
            )
          )}

        </div>
      )}

      {/* MOBILE ORDERS */}

      {orders.length > 0 && (
        <div className="space-y-4 md:hidden">

          {orders.map(
            (order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-[26px] border border-neutral-800 bg-neutral-950 p-6 transition hover:border-neutral-600"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm text-white">
                      {order.order_number}
                    </p>

                    <p className="mt-1 text-xs text-neutral-600">
                      {formatDate(
                        order.created_at
                      )}
                    </p>

                  </div>

                  <Eye
                    size={17}
                    className="shrink-0 text-neutral-600"
                  />

                </div>

                <div className="mt-6">

                  <p className="text-sm">
                    {order.first_name}{" "}
                    {order.last_name}
                  </p>

                  <p className="mt-1 truncate text-xs text-neutral-600">
                    {order.customer_email}
                  </p>

                </div>

                <div className="mt-6 flex items-end justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                      Total
                    </p>

                    <p className="mt-1 text-lg">
                      ₦
                      {Number(
                        order.total
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex flex-col items-end gap-2">

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${paymentStatusClass(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${orderStatusClass(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>

                  </div>

                </div>

              </Link>
            )
          )}

        </div>
      )}

    </div>
  );
}