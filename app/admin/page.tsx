"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Package,
  ShoppingBag,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type DashboardStats = {
  products: number;
  availableProducts: number;
  soldOutProducts: number;

  orders: number;
  pendingOrders: number;
  processingOrders: number;

  reviews: number;

  revenue: number;
};

type RecentOrder = {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  customer_email: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

const sections = [
  {
    title: "Products",
    description:
      "Add, edit and manage products in the THARU shop.",
    href: "/admin/products",
    icon: Package,
  },

  {
    title: "Orders",
    description:
      "View and manage customer orders.",
    href: "/admin/orders",
    icon: ShoppingBag,
  },

  {
    title: "Reviews",
    description:
      "View customer reviews and remove unwanted reviews.",
    href: "/admin/reviews",
    icon: MessageSquare,
  },

  {
    title: "Blog",
    description:
      "Create and manage THARU stories and articles.",
    href: "/admin/blog",
    icon: FileText,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<DashboardStats>({
      products: 0,
      availableProducts: 0,
      soldOutProducts: 0,

      orders: 0,
      pendingOrders: 0,
      processingOrders: 0,

      reviews: 0,

      revenue: 0,
    });

  const [recentOrders, setRecentOrders] =
    useState<RecentOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * LOAD DASHBOARD DATA
   */

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      /*
       * PRODUCTS
       */

      const {
        data: products,
        error: productsError,
      } = await supabase
        .from("products")
        .select(
          "id, stock, is_sold_out"
        );

      if (productsError) {
        throw productsError;
      }

      /*
       * ORDERS
       */

      const {
        data: orders,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            first_name,
            last_name,
            customer_email,
            total,
            payment_status,
            order_status,
            created_at
          `
        )
        .order("created_at", {
          ascending: false,
        });

      if (ordersError) {
        throw ordersError;
      }

      /*
       * REVIEWS
       */

      const {
        count: reviewCount,
        error: reviewsError,
      } = await supabase
        .from("reviews")
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        );

      if (reviewsError) {
        throw reviewsError;
      }

      /*
       * PRODUCT STATISTICS
       *
       * Availability is based on
       * the admin's manual
       * is_sold_out setting.
       */

      const totalProducts =
        products?.length || 0;

      const soldOutProducts =
        products?.filter(
          (product) =>
            product.is_sold_out === true
        ).length || 0;

      const availableProducts =
        totalProducts -
        soldOutProducts;

      /*
       * ORDER STATISTICS
       */

      const allOrders =
        orders || [];

      const totalOrders =
        allOrders.length;

      const pendingOrders =
        allOrders.filter(
          (order) =>
            order.order_status ===
            "pending"
        ).length;

      const processingOrders =
        allOrders.filter(
          (order) =>
            order.order_status ===
            "processing"
        ).length;

      /*
       * REVENUE
       *
       * Only successfully paid
       * orders are included.
       */

      const revenue =
        allOrders
          .filter(
            (order) =>
              order.payment_status ===
              "paid"
          )
          .reduce(
            (
              total,
              order
            ) =>
              total +
              Number(
                order.total
              ),
            0
          );

      /*
       * RECENT ORDERS
       */

      setRecentOrders(
        allOrders.slice(0, 5)
      );

      /*
       * UPDATE DASHBOARD STATS
       */

      setStats({
        products:
          totalProducts,

        availableProducts:
          availableProducts,

        soldOutProducts:
          soldOutProducts,

        orders:
          totalOrders,

        pendingOrders:
          pendingOrders,

        processingOrders:
          processingOrders,

        reviews:
          reviewCount || 0,

        revenue:
          revenue,
      });

    } catch (dashboardError) {
      console.error(
        "Dashboard loading error:",
        dashboardError
      );

      setError(
        "Unable to load dashboard information."
      );

    } finally {
      setLoading(false);
    }
  };

  /*
   * INITIAL LOAD
   */

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
   * FORMAT MONEY
   */

  const formatMoney = (
    amount: number
  ) => {
    return `₦${Number(
      amount
    ).toLocaleString("en-NG")}`;
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
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * ORDER STATUS STYLE
   */

  const orderStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "processing":
        return "text-blue-400";

      case "shipped":
        return "text-purple-400";

      case "delivered":
        return "text-emerald-400";

      case "cancelled":
        return "text-red-400";

      default:
        return "text-neutral-500";
    }
  };

  return (
    <div className="mx-auto max-w-7xl">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="mb-12">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Administration
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-6xl">
          Dashboard
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
          Manage your THARU store, products,
          orders, reviews and content from one
          place.
        </p>

      </div>

      {/* ========================= */}
      {/* ERROR */}
      {/* ========================= */}

      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-[20px] border border-red-950 bg-red-950/20 p-5 text-sm text-red-400">

          <AlertCircle
            size={17}
          />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* ========================= */}
      {/* OVERVIEW */}
      {/* ========================= */}

      <div className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* PRODUCTS */}

        <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 p-6">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              Products
            </p>

            <Package
              size={16}
              className="text-neutral-700"
            />

          </div>

          <p className="mt-4 text-3xl font-light">
            {loading
              ? "—"
              : stats.products}
          </p>

          <p className="mt-2 text-xs text-neutral-600">
            {loading
              ? "Loading inventory..."
              : `${stats.availableProducts} available · ${stats.soldOutProducts} sold out`}
          </p>

        </div>

        {/* ORDERS */}

        <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 p-6">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              Orders
            </p>

            <ShoppingBag
              size={16}
              className="text-neutral-700"
            />

          </div>

          <p className="mt-4 text-3xl font-light">
            {loading
              ? "—"
              : stats.orders}
          </p>

          <p className="mt-2 text-xs text-neutral-600">
            {loading
              ? "Loading orders..."
              : `${stats.pendingOrders} pending · ${stats.processingOrders} processing`}
          </p>

        </div>

        {/* REVIEWS */}

        <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 p-6">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              Reviews
            </p>

            <MessageSquare
              size={16}
              className="text-neutral-700"
            />

          </div>

          <p className="mt-4 text-3xl font-light">
            {loading
              ? "—"
              : stats.reviews}
          </p>

          <p className="mt-2 text-xs text-neutral-600">
            Customer feedback
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* STORE OVERVIEW */}
      {/* ========================= */}

      <div className="mb-12">

        <div className="mb-6">

          <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
            Store Overview
          </p>

          <h2 className="mt-2 text-2xl font-light">
            THARU Store
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* REVENUE */}

          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-7">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                  Paid Revenue
                </p>

                <p className="mt-4 text-3xl font-light">
                  {loading
                    ? "—"
                    : formatMoney(
                        stats.revenue
                      )}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800">

                <TrendingUp
                  size={20}
                  className="text-neutral-500"
                />

              </div>

            </div>

            <p className="mt-4 text-sm text-neutral-600">
              Total from successfully paid orders.
            </p>

          </div>

          {/* INVENTORY */}

          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-7">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                  Inventory
                </p>

                <p className="mt-4 text-3xl font-light">
                  {loading
                    ? "—"
                    : stats.availableProducts}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800">

                {stats.soldOutProducts >
                0 ? (
                  <AlertCircle
                    size={20}
                    className="text-neutral-500"
                  />
                ) : (
                  <CheckCircle2
                    size={20}
                    className="text-neutral-500"
                  />
                )}

              </div>

            </div>

            <p className="mt-4 text-sm text-neutral-600">

              {loading
                ? "Checking inventory..."
                : stats.soldOutProducts ===
                  0
                ? "All products are currently available."
                : `${stats.soldOutProducts} product${
                    stats.soldOutProducts ===
                    1
                      ? ""
                      : "s"
                  } marked sold out.`}

            </p>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* RECENT ORDERS */}
      {/* ========================= */}

      <div className="mb-12">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
              Activity
            </p>

            <h2 className="mt-2 text-2xl font-light">
              Recent Orders
            </h2>

          </div>

          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:text-white"
          >
            View all →
          </Link>

        </div>

        <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-950">

          {/* LOADING */}

          {loading ? (

            <div className="p-10 text-center">

              <p className="text-sm text-neutral-600">
                Loading recent orders...
              </p>

            </div>

          ) : recentOrders.length ===
            0 ? (

            /* EMPTY */

            <div className="p-10 text-center">

              <Clock3
                size={24}
                className="mx-auto text-neutral-700"
              />

              <p className="mt-4 text-sm text-neutral-500">
                No orders yet.
              </p>

            </div>

          ) : (

            /* ORDERS */

            <div>

              {recentOrders.map(
                (order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex flex-col gap-4 border-b border-neutral-900 px-6 py-5 transition last:border-b-0 hover:bg-neutral-900/40 md:flex-row md:items-center md:justify-between"
                  >

                    {/* CUSTOMER / ORDER */}

                    <div className="min-w-0">

                      <p className="text-sm text-white">
                        {order.order_number}
                      </p>

                      <p className="mt-1 truncate text-xs text-neutral-600">
                        {order.first_name}{" "}
                        {order.last_name}
                        {" · "}
                        {order.customer_email}
                      </p>

                    </div>

                    {/* TOTAL / STATUS */}

                    <div className="flex items-center justify-between gap-6 md:justify-end">

                      <div className="text-right">

                        <p className="text-sm">
                          {formatMoney(
                            Number(
                              order.total
                            )
                          )}
                        </p>

                        <p className="mt-1 text-xs text-neutral-700">
                          {formatDate(
                            order.created_at
                          )}
                        </p>

                      </div>

                      <div className="min-w-[90px] text-right">

                        <p
                          className={`text-[10px] uppercase tracking-[0.15em] ${orderStatusClass(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </p>

                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* ========================= */}
      {/* MANAGEMENT */}
      {/* ========================= */}

      <div>

        <div className="mb-6">

          <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
            Management
          </p>

          <h2 className="mt-2 text-2xl font-light">
            THARU Store
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {sections.map(
            (section) => {

              const Icon =
                section.icon;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group rounded-[28px] border border-neutral-800 bg-neutral-950 p-7 transition hover:border-neutral-600"
                >

                  <div className="mb-8 flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800">

                      <Icon
                        size={20}
                      />

                    </div>

                    <span className="text-neutral-700 transition group-hover:text-white">
                      →
                    </span>

                  </div>

                  <h3 className="text-xl font-light">
                    {section.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                    {section.description}
                  </p>

                </Link>
              );

            }
          )}

        </div>

      </div>

    </div>
  );
}