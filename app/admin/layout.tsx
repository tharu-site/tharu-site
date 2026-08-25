"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  /*
   * LOGIN PAGE
   */

  const isLoginPage =
    pathname === "/admin/login";

  /*
   * CHECK ADMIN ACCESS
   */

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    let mounted = true;

    const checkAdmin = async () => {
      try {
        console.log(
          "ADMIN: Checking authentication..."
        );

        const {
          data: sessionData,
          error: sessionError,
        } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            "ADMIN: Session error:",
            sessionError
          );

          if (mounted) {
            setCheckingAuth(false);
          }

          router.replace("/admin/login");
          return;
        }

        const user =
          sessionData.session?.user;

        console.log(
          "ADMIN: User:",
          user?.id
        );

        if (!user) {
          console.log(
            "ADMIN: No authenticated user."
          );

          if (mounted) {
            setCheckingAuth(false);
          }

          router.replace("/admin/login");
          return;
        }

        console.log(
          "ADMIN: Checking admin_users..."
        );

        const {
          data: adminUser,
          error: adminError,
        } =
          await supabase
            .from("admin_users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

        if (adminError) {
          console.error(
            "ADMIN: admin_users error:",
            adminError
          );

          if (mounted) {
            setCheckingAuth(false);
          }

          router.replace("/admin/login");
          return;
        }

        if (!adminUser) {
          console.error(
            "ADMIN: User is not in admin_users."
          );

          await supabase.auth.signOut();

          if (mounted) {
            setCheckingAuth(false);
          }

          router.replace("/admin/login");
          return;
        }

        console.log(
          "ADMIN: Access granted."
        );

        if (mounted) {
          setCheckingAuth(false);
        }

      } catch (error) {
        console.error(
          "ADMIN: Unexpected authentication error:",
          error
        );

        if (mounted) {
          setCheckingAuth(false);
        }

        router.replace("/admin/login");
      }
    };

    checkAdmin();

    return () => {
      mounted = false;
    };

  }, [
    isLoginPage,
    router,
  ]);

  /*
   * LOGIN PAGE
   */

  if (isLoginPage) {
    return (
      <>
        {children}
      </>
    );
  }

  /*
   * CHECKING ACCESS
   */

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Checking access...
        </p>
      </main>
    );
  }

  /*
   * LOGOUT
   */

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setCheckingAuth(false);
      setMobileOpen(false);

      router.replace("/admin/login");
      router.refresh();
    }
  };

  /*
   * ADMIN PANEL
   */

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      {/* MOBILE HEADER */}

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-neutral-900 bg-[#0d0d0d] px-5 lg:hidden">

        <Link
          href="/admin"
          className="text-sm uppercase tracking-[0.3em]"
        >
          THARU
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="rounded-full border border-neutral-800 p-2"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

      </header>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0d0d0d] pt-20 lg:hidden">

          <nav className="px-5">

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`mb-2 flex items-center gap-4 rounded-2xl px-4 py-4 text-sm transition ${
                      active
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />

                    {item.name}
                  </Link>
                );
              }
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-sm text-neutral-500 transition hover:bg-neutral-900 hover:text-white"
            >
              <LogOut size={18} />

              Sign Out
            </button>

          </nav>

        </div>
      )}

      {/* DESKTOP SIDEBAR */}

      <aside className="fixed bottom-0 left-0 top-0 hidden w-64 border-r border-neutral-900 bg-[#0d0d0d] lg:flex lg:flex-col">

        {/* LOGO */}

        <div className="border-b border-neutral-900 px-7 py-7">

          <Link
            href="/admin"
            className="text-lg uppercase tracking-[0.35em]"
          >
            THARU
          </Link>

          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-neutral-600">
            Admin Panel
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-4 px-3 text-[10px] uppercase tracking-[0.3em] text-neutral-700">
            Management
          </p>

          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-white text-black"
                      : "text-neutral-500 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <Icon size={17} />

                  <span>
                    {item.name}
                  </span>
                </Link>
              );
            }
          )}

        </nav>

        {/* SIGN OUT */}

        <div className="border-t border-neutral-900 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-500 transition hover:bg-neutral-900 hover:text-white"
          >
            <LogOut size={17} />

            Sign Out
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="min-h-screen lg:ml-64">

        <div className="px-5 pb-16 pt-24 lg:px-10 lg:pt-10">

          {children}

        </div>

      </main>

    </div>
  );
}