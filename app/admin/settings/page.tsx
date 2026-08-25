"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Save,
  Store,
  Truck,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type StoreSettings = {
  id: string;
  store_name: string;
  store_email: string | null;
  store_phone: string | null;
  store_address: string | null;
  currency: string;
  delivery_fee: number;
  accepting_orders: boolean;
  updated_at: string;
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<StoreSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * FORM STATE
   */

  const [storeName, setStoreName] =
    useState("");

  const [storeEmail, setStoreEmail] =
    useState("");

  const [storePhone, setStorePhone] =
    useState("");

  const [storeAddress, setStoreAddress] =
    useState("");

  const [currency, setCurrency] =
    useState("NGN");

  const [deliveryFee, setDeliveryFee] =
    useState("");

  const [acceptingOrders, setAcceptingOrders] =
    useState(true);

  /*
   * LOAD SETTINGS
   */

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError("");

      const {
        data,
        error: settingsError,
      } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (settingsError) {
        console.error(
          "Settings loading error:",
          settingsError
        );

        setError(
          "Unable to load store settings."
        );

        setLoading(false);

        return;
      }

      /*
       * NO SETTINGS RECORD
       */

      if (!data) {
        setError(
          "No store settings have been configured yet."
        );

        setLoading(false);

        return;
      }

      /*
       * STORE SETTINGS
       */

      setSettings(data);

      setStoreName(
        data.store_name || ""
      );

      setStoreEmail(
        data.store_email || ""
      );

      setStorePhone(
        data.store_phone || ""
      );

      setStoreAddress(
        data.store_address || ""
      );

      setCurrency(
        data.currency || "NGN"
      );

      setDeliveryFee(
        String(
          data.delivery_fee ?? 0
        )
      );

      setAcceptingOrders(
        Boolean(
          data.accepting_orders
        )
      );

      setLoading(false);
    };

    loadSettings();
  }, []);

  /*
   * SAVE SETTINGS
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

    if (!storeName.trim()) {
      setError(
        "Please enter a store name."
      );

      return;
    }

    if (
      storeEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        storeEmail.trim()
      )
    ) {
      setError(
        "Please enter a valid store email."
      );

      return;
    }

    if (
      deliveryFee === "" ||
      Number(deliveryFee) < 0
    ) {
      setError(
        "Please enter a valid delivery fee."
      );

      return;
    }

    if (!settings) {
      setError(
        "Store settings could not be found."
      );

      return;
    }

    setSaving(true);

    /*
     * UPDATE SUPABASE
     */

    const {
      data,
      error: updateError,
    } = await supabase
      .from("store_settings")
      .update({
        store_name:
          storeName.trim(),

        store_email:
          storeEmail.trim() ||
          null,

        store_phone:
          storePhone.trim() ||
          null,

        store_address:
          storeAddress.trim() ||
          null,

        currency:
          currency,

        delivery_fee:
          Number(deliveryFee),

        accepting_orders:
          acceptingOrders,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", settings.id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "Settings update error:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to save settings."
      );

      setSaving(false);

      return;
    }

    /*
     * UPDATE LOCAL STATE
     */

    setSettings(data);

    setSuccess(
      "Store settings saved successfully."
    );

    setSaving(false);

    /*
     * REMOVE SUCCESS MESSAGE
     * AFTER A FEW SECONDS
     */

    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Administration
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-5xl">
          Settings
        </h1>

        <div className="mt-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <p className="text-sm text-neutral-500">
            Loading settings...
          </p>

        </div>

      </div>
    );
  }

  /*
   * STYLES
   */

  const inputClass =
    "h-14 w-full rounded-2xl border border-neutral-800 bg-black px-5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white";

  const textareaClass =
    "w-full resize-none rounded-[22px] border border-neutral-800 bg-black px-5 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-neutral-600 focus:border-white";

  /*
   * PAGE
   */

  return (
    <div className="mx-auto max-w-5xl">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
          THARU Administration
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-5xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
          Manage your store information,
          delivery settings and purchasing
          availability.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-8 flex items-start gap-3 rounded-[20px] border border-red-950 bg-red-950/20 p-5 text-sm text-red-400">

          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>
            {error}
          </p>

        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-8 flex items-start gap-3 rounded-[20px] border border-emerald-950 bg-emerald-950/20 p-5 text-sm text-emerald-400">

          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>
            {success}
          </p>

        </div>
      )}

      {!settings ? (
        <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-10 text-center">

          <Store
            size={30}
            className="mx-auto text-neutral-700"
          />

          <h2 className="mt-5 text-xl font-light">
            Store settings unavailable
          </h2>

          <p className="mt-3 text-sm text-neutral-600">
            Create the store_settings table
            and add its initial record in
            Supabase before using this page.
          </p>

        </div>
      ) : (

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ========================= */}
          {/* STORE INFORMATION */}
          {/* ========================= */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800">

                <Store
                  size={19}
                  className="text-neutral-500"
                />

              </div>

              <div>

                <h2 className="text-xl font-light">
                  Store Information
                </h2>

                <p className="mt-1 text-sm text-neutral-600">
                  Basic information about your
                  THARU store.
                </p>

              </div>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {/* STORE NAME */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Store Name
                </label>

                <input
                  required
                  value={storeName}
                  onChange={(event) =>
                    setStoreName(
                      event.target.value
                    )
                  }
                  placeholder="THARU"
                  className={inputClass}
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500">

                  <Mail size={13} />

                  Store Email

                </label>

                <input
                  type="email"
                  value={storeEmail}
                  onChange={(event) =>
                    setStoreEmail(
                      event.target.value
                    )
                  }
                  placeholder="tharuwatch@gmail.com"
                  className={inputClass}
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500">

                  <Phone size={13} />

                  Store Phone

                </label>

                <input
                  type="tel"
                  value={storePhone}
                  onChange={(event) =>
                    setStorePhone(
                      event.target.value
                    )
                  }
                  placeholder="+234..."
                  className={inputClass}
                />

              </div>

              {/* ADDRESS */}

              <div className="md:col-span-2">

                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500">

                  <MapPin size={13} />

                  Store Address

                </label>

                <textarea
                  rows={4}
                  value={storeAddress}
                  onChange={(event) =>
                    setStoreAddress(
                      event.target.value
                    )
                  }
                  placeholder="Enter your store address"
                  className={textareaClass}
                />

              </div>

            </div>

          </section>

          {/* ========================= */}
          {/* DELIVERY */}
          {/* ========================= */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800">

                <Truck
                  size={19}
                  className="text-neutral-500"
                />

              </div>

              <div>

                <h2 className="text-xl font-light">
                  Delivery
                </h2>

                <p className="mt-1 text-sm text-neutral-600">
                  Configure the default delivery
                  charge used by your store.
                </p>

              </div>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {/* CURRENCY */}

              <div>

                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Currency
                </label>

                <select
                  value={currency}
                  onChange={(event) =>
                    setCurrency(
                      event.target.value
                    )
                  }
                  className={inputClass}
                >

                  <option
                    value="NGN"
                    className="bg-black"
                  >
                    Nigerian Naira (₦)
                  </option>

                </select>

              </div>

              {/* DELIVERY FEE */}

              <div>

                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Default Delivery Fee (₦)
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(event) =>
                    setDeliveryFee(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />

              </div>

            </div>

            <p className="mt-5 text-xs leading-relaxed text-neutral-600">
              This is your default delivery
              charge. We can later expand
              this to support different fees
              by city or state.
            </p>

          </section>

          {/* ========================= */}
          {/* ORDER SETTINGS */}
          {/* ========================= */}

          <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800">

                <ShoppingBag
                  size={19}
                  className="text-neutral-500"
                />

              </div>

              <div>

                <h2 className="text-xl font-light">
                  Order Settings
                </h2>

                <p className="mt-1 text-sm text-neutral-600">
                  Control whether customers can
                  place new orders.
                </p>

              </div>

            </div>

            <div className="mt-8">

              <button
                type="button"
                onClick={() =>
                  setAcceptingOrders(
                    (current) =>
                      !current
                  )
                }
                className={`flex w-full items-center justify-between rounded-[22px] border p-5 text-left transition ${
                  acceptingOrders
                    ? "border-emerald-900 bg-emerald-950/20"
                    : "border-red-900 bg-red-950/20"
                }`}
              >

                <div className="flex items-center gap-4">

                  <span
                    className={`h-3 w-3 rounded-full ${
                      acceptingOrders
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />

                  <div>

                    <p className="text-sm">
                      {acceptingOrders
                        ? "Accepting orders"
                        : "Orders paused"}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">

                      {acceptingOrders
                        ? "Customers can currently purchase products."
                        : "Customers should not be able to place new orders."}

                    </p>

                  </div>

                </div>

                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    acceptingOrders
                      ? "bg-emerald-900"
                      : "bg-red-900"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      acceptingOrders
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </span>

              </button>

            </div>

          </section>

          {/* ========================= */}
          {/* SAVE */}
          {/* ========================= */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

            <p className="mr-auto text-xs text-neutral-700">
              Changes are saved to your
              Supabase store settings.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Save size={15} />

              {saving
                ? "Saving..."
                : "Save Settings"}

            </button>

          </div>

        </form>

      )}

    </div>
  );
}