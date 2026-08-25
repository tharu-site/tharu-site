"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(
          "Invalid email or password."
        );
        return;
      }

      if (!authData.user) {
        setError(
          "Unable to authenticate. Please try again."
        );
        return;
      }

      /*
       * CHECK THAT THE USER IS ACTUALLY
       * A THARU ADMIN.
       */

      const { data: adminUser, error: adminError } =
        await supabase
          .from("admin_users")
          .select("id")
          .eq("id", authData.user.id)
          .maybeSingle();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();

        setError(
          "You do not have permission to access the admin area."
        );

        return;
      }

      router.push("/admin");

      router.refresh();

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <div className="flex min-h-screen items-center justify-center px-6">

        <div className="w-full max-w-md">

          {/* BRAND */}

          <div className="mb-10 text-center">

            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-neutral-500">
              THARU
            </p>

            <h1 className="text-4xl font-light">
              Admin Login
            </h1>

            <p className="mt-4 text-sm text-neutral-500">
              Sign in to manage THARU reviews.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="rounded-[32px] border border-neutral-800 bg-neutral-950 p-6 md:p-8"
          >

            {/* EMAIL */}

            <div className="mb-5">

              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500"
              >
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Admin email"
                className="h-14 w-full rounded-full border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
              />

            </div>

            {/* PASSWORD */}

            <div className="mb-6">

              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Password"
                className="h-14 w-full rounded-full border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-[20px] border border-neutral-800 bg-black px-5 py-4 text-sm leading-relaxed text-neutral-400">
                {error}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-full bg-white text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}