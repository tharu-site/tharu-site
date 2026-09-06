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
  Pencil,
  Trash2,
  Power,
  Plus,
  X,
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

type DeliveryFee = {
  id: string;
  state: string;
  fee: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

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
   * STATE DELIVERY FEES
   */

  const [deliveryFees, setDeliveryFees] =
    useState<DeliveryFee[]>([]);

  const [deliveryLoading, setDeliveryLoading] =
    useState(true);

  const [deliverySaving, setDeliverySaving] =
    useState(false);

  const [selectedState, setSelectedState] =
    useState("");

  const [selectedFee, setSelectedFee] =
    useState("");

  const [editingDeliveryId, setEditingDeliveryId] =
    useState<string | null>(null);

  const [deliveryError, setDeliveryError] =
    useState("");

  const [deliverySuccess, setDeliverySuccess] =
    useState("");

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
   * LOAD STATE DELIVERY FEES
   */

  useEffect(() => {
    const loadDeliveryFees = async () => {
      setDeliveryLoading(true);
      setDeliveryError("");

      const {
        data,
        error: deliveryFeesError,
      } = await supabase
        .from("delivery_fees")
        .select("*")
        .order("state", {
          ascending: true,
        });

      if (deliveryFeesError) {
        console.error(
          "Delivery fees loading error:",
          deliveryFeesError
        );

        setDeliveryError(
          "Unable to load state delivery fees."
        );

        setDeliveryLoading(false);

        return;
      }

      setDeliveryFees(
        data || []
      );

      setDeliveryLoading(false);
    };

    loadDeliveryFees();
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
   * ADD / UPDATE STATE DELIVERY FEE
   */

  const handleDeliverySubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setDeliveryError("");
    setDeliverySuccess("");

    /*
     * VALIDATION
     */

    if (!selectedState) {
      setDeliveryError(
        "Please select a state."
      );

      return;
    }

    if (
      selectedFee === "" ||
      Number(selectedFee) < 0
    ) {
      setDeliveryError(
        "Please enter a valid delivery fee."
      );

      return;
    }

    setDeliverySaving(true);

    /*
     * UPDATE EXISTING FEE
     */

    if (editingDeliveryId) {
      const {
        error: updateError,
      } = await supabase
        .from("delivery_fees")
        .update({
          state: selectedState,
          fee: Number(selectedFee),
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          editingDeliveryId
        );

      if (updateError) {
        console.error(
          "Delivery fee update error:",
          updateError
        );

        setDeliveryError(
          updateError.message ||
            "Unable to update delivery fee."
        );

        setDeliverySaving(false);

        return;
      }

      setDeliverySuccess(
        `${selectedState} delivery fee updated successfully.`
      );
    } else {
      /*
       * CHECK FOR DUPLICATE STATE
       */

      const existingState =
        deliveryFees.find(
          (item) =>
            item.state.toLowerCase() ===
            selectedState.toLowerCase()
        );

      if (existingState) {
        setDeliveryError(
          "A delivery fee for this state already exists. Please edit the existing fee instead."
        );

        setDeliverySaving(false);

        return;
      }

      /*
       * INSERT NEW FEE
       */

      const {
        error: insertError,
      } = await supabase
        .from("delivery_fees")
        .insert({
          state: selectedState,
          fee: Number(selectedFee),
          active: true,
        });

      if (insertError) {
        console.error(
          "Delivery fee insert error:",
          insertError
        );

        setDeliveryError(
          insertError.message ||
            "Unable to add delivery fee."
        );

        setDeliverySaving(false);

        return;
      }

      setDeliverySuccess(
        `${selectedState} delivery fee added successfully.`
      );
    }

    /*
     * RESET FORM
     */

    setSelectedState("");
    setSelectedFee("");
    setEditingDeliveryId(null);

    /*
     * REFRESH DELIVERY FEES
     */

    const {
      data,
      error: reloadError,
    } = await supabase
      .from("delivery_fees")
      .select("*")
      .order("state", {
        ascending: true,
      });

    if (!reloadError) {
      setDeliveryFees(
        data || []
      );
    }

    setDeliverySaving(false);

    /*
     * REMOVE SUCCESS MESSAGE
     */

    setTimeout(() => {
      setDeliverySuccess("");
    }, 4000);
  };

  /*
   * EDIT DELIVERY FEE
   */

  const handleEditDelivery = (
    item: DeliveryFee
  ) => {
    setEditingDeliveryId(
      item.id
    );

    setSelectedState(
      item.state
    );

    setSelectedFee(
      String(item.fee)
    );

    setDeliveryError("");
    setDeliverySuccess("");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  /*
   * CANCEL EDIT
   */

  const handleCancelEdit = () => {
    setEditingDeliveryId(null);
    setSelectedState("");
    setSelectedFee("");
    setDeliveryError("");
    setDeliverySuccess("");
  };

  /*
   * ACTIVATE / DEACTIVATE DELIVERY FEE
   */

  const handleToggleDelivery = async (
    item: DeliveryFee
  ) => {
    setDeliveryError("");
    setDeliverySuccess("");

    const {
      error: updateError,
    } = await supabase
      .from("delivery_fees")
      .update({
        active: !item.active,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        item.id
      );

    if (updateError) {
      console.error(
        "Delivery fee status error:",
        updateError
      );

      setDeliveryError(
        updateError.message ||
          "Unable to update delivery fee status."
      );

      return;
    }

    setDeliverySuccess(
      `${item.state} delivery fee ${
        item.active
          ? "deactivated"
          : "activated"
      }.`
    );

    /*
     * REFRESH LIST
     */

    const {
      data,
      error: reloadError,
    } = await supabase
      .from("delivery_fees")
      .select("*")
      .order("state", {
        ascending: true,
      });

    if (!reloadError) {
      setDeliveryFees(
        data || []
      );
    }

    setTimeout(() => {
      setDeliverySuccess("");
    }, 4000);
  };

  /*
   * DELETE DELIVERY FEE
   */

  const handleDeleteDelivery = async (
    item: DeliveryFee
  ) => {
    const confirmed =
      window.confirm(
        `Delete the delivery fee for ${item.state}?`
      );

    if (!confirmed) {
      return;
    }

    setDeliveryError("");
    setDeliverySuccess("");

    const {
      error: deleteError,
    } = await supabase
      .from("delivery_fees")
      .delete()
      .eq(
        "id",
        item.id
      );

    if (deleteError) {
      console.error(
        "Delivery fee delete error:",
        deleteError
      );

      setDeliveryError(
        deleteError.message ||
          "Unable to delete delivery fee."
      );

      return;
    }

    /*
     * REMOVE FROM LOCAL STATE
     */

    setDeliveryFees(
      (current) =>
        current.filter(
          (fee) =>
            fee.id !== item.id
        )
    );

    /*
     * IF EDITING THIS ITEM,
     * CANCEL EDIT MODE
     */

    if (
      editingDeliveryId ===
      item.id
    ) {
      handleCancelEdit();
    }

    setDeliverySuccess(
      `${item.state} delivery fee deleted successfully.`
    );

    setTimeout(() => {
      setDeliverySuccess("");
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

      {/* STORE ERROR */}

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

      {/* STORE SUCCESS */}

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

        <>
          {/* ================================= */}
          {/* MAIN STORE SETTINGS FORM */}
          {/* ================================= */}

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

                {/* DEFAULT DELIVERY FEE */}

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
                charge. It will be used when a
                customer selects a state that does
                not have an active state-specific
                delivery fee.
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

          {/* ================================= */}
          {/* STATE DELIVERY FEES */}
          {/* ================================= */}

          <section className="mt-12 rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 md:p-8">

            {/* HEADER */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800">

                <Truck
                  size={19}
                  className="text-neutral-500"
                />

              </div>

              <div>

                <h2 className="text-xl font-light">
                  State Delivery Fees
                </h2>

                <p className="mt-1 text-sm text-neutral-600">
                  Set a specific delivery fee for
                  individual Nigerian states.
                </p>

              </div>

            </div>

            {/* DELIVERY ERROR */}

            {deliveryError && (
              <div className="mt-6 flex items-start gap-3 rounded-[20px] border border-red-950 bg-red-950/20 p-5 text-sm text-red-400">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  {deliveryError}
                </p>

              </div>
            )}

            {/* DELIVERY SUCCESS */}

            {deliverySuccess && (
              <div className="mt-6 flex items-start gap-3 rounded-[20px] border border-emerald-950 bg-emerald-950/20 p-5 text-sm text-emerald-400">

                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  {deliverySuccess}
                </p>

              </div>
            )}

            {/* ========================= */}
            {/* STATE FEE FORM */}
            {/* ========================= */}

            <form
              onSubmit={handleDeliverySubmit}
              className="mt-8"
            >

              <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto]">

                {/* STATE */}

                <div>

                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Nigerian State
                  </label>

                  <select
                    required
                    value={selectedState}
                    onChange={(event) =>
                      setSelectedState(
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >

                    <option
                      value=""
                      className="bg-black"
                    >
                      Select a state
                    </option>

                    {nigerianStates.map(
                      (state) => {
                        const alreadyExists =
                          deliveryFees.some(
                            (item) =>
                              item.state.toLowerCase() ===
                              state.toLowerCase()
                          );

                        /*
                         * When editing, allow the
                         * currently selected state.
                         */

                        const isCurrentState =
                          editingDeliveryId &&
                          deliveryFees.some(
                            (item) =>
                              item.id ===
                                editingDeliveryId &&
                              item.state ===
                                state
                          );

                        return (
                          <option
                            key={state}
                            value={state}
                            disabled={
                              alreadyExists &&
                              !isCurrentState
                            }
                            className="bg-black"
                          >
                            {state}
                            {alreadyExists &&
                            !isCurrentState
                              ? " — already configured"
                              : ""}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>

                {/* FEE */}

                <div>

                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Delivery Fee (₦)
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={selectedFee}
                    onChange={(event) =>
                      setSelectedFee(
                        event.target.value
                      )
                    }
                    placeholder="5000"
                    className={inputClass}
                  />

                </div>

                {/* ACTIONS */}

                <div className="flex items-end gap-3">

                  <button
                    type="submit"
                    disabled={deliverySaving}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-medium uppercase tracking-[0.18em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {editingDeliveryId ? (
                      <>
                        <Save size={15} />

                        {deliverySaving
                          ? "Saving..."
                          : "Update"}
                      </>
                    ) : (
                      <>
                        <Plus size={15} />

                        {deliverySaving
                          ? "Adding..."
                          : "Add Fee"}
                      </>
                    )}

                  </button>

                  {editingDeliveryId && (
                    <button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition hover:border-neutral-600 hover:text-white"
                      title="Cancel editing"
                    >

                      <X size={17} />

                    </button>
                  )}

                </div>

              </div>

            </form>

            {/* ========================= */}
            {/* DELIVERY FEE LIST */}
            {/* ========================= */}

            <div className="mt-10">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-medium">
                    Configured States
                  </h3>

                  <p className="mt-1 text-xs text-neutral-600">
                    Active fees are automatically
                    used during checkout.
                  </p>

                </div>

                <span className="text-xs text-neutral-600">
                  {deliveryFees.length}{" "}
                  {deliveryFees.length === 1
                    ? "state"
                    : "states"}
                </span>

              </div>

              {deliveryLoading ? (
                <div className="rounded-[22px] border border-neutral-800 bg-black p-8 text-center">

                  <p className="text-sm text-neutral-600">
                    Loading delivery fees...
                  </p>

                </div>
              ) : deliveryFees.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-neutral-800 bg-black p-10 text-center">

                  <Truck
                    size={28}
                    className="mx-auto text-neutral-700"
                  />

                  <p className="mt-4 text-sm text-neutral-400">
                    No state delivery fees configured.
                  </p>

                  <p className="mt-2 text-xs text-neutral-700">
                    Add a state and delivery fee
                    above to get started.
                  </p>

                </div>
              ) : (
                <div className="overflow-hidden rounded-[22px] border border-neutral-800">

                  {/* DESKTOP HEADER */}

                  <div className="hidden grid-cols-[1fr_160px_120px_150px] gap-4 border-b border-neutral-800 bg-black px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-neutral-600 md:grid">

                    <div>
                      State
                    </div>

                    <div>
                      Delivery Fee
                    </div>

                    <div>
                      Status
                    </div>

                    <div className="text-right">
                      Actions
                    </div>

                  </div>

                  {/* ITEMS */}

                  <div className="divide-y divide-neutral-900">

                    {deliveryFees.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="grid gap-5 bg-neutral-950 px-5 py-5 md:grid-cols-[1fr_160px_120px_150px] md:items-center"
                        >

                          {/* STATE */}

                          <div>

                            <p className="text-sm text-white">
                              {item.state}
                            </p>

                            <p className="mt-1 text-xs text-neutral-700 md:hidden">
                              {item.active
                                ? "Active"
                                : "Inactive"}
                            </p>

                          </div>

                          {/* FEE */}

                          <div className="text-sm text-neutral-300">

                            ₦
                            {Number(
                              item.fee
                            ).toLocaleString()}

                          </div>

                          {/* STATUS */}

                          <div>

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                                item.active
                                  ? "bg-emerald-950 text-emerald-400"
                                  : "bg-neutral-900 text-neutral-600"
                              }`}
                            >
                              {item.active
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                          {/* ACTIONS */}

                          <div className="flex items-center justify-start gap-2 md:justify-end">

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditDelivery(
                                  item
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 text-neutral-500 transition hover:border-neutral-600 hover:text-white"
                              title="Edit delivery fee"
                            >

                              <Pencil
                                size={14}
                              />

                            </button>

                            {/* ACTIVATE / DEACTIVATE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleDelivery(
                                  item
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                item.active
                                  ? "border-neutral-800 text-neutral-500 hover:border-red-900 hover:text-red-400"
                                  : "border-neutral-800 text-neutral-500 hover:border-emerald-900 hover:text-emerald-400"
                              }`}
                              title={
                                item.active
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >

                              <Power
                                size={14}
                              />

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteDelivery(
                                  item
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 text-neutral-500 transition hover:border-red-900 hover:text-red-400"
                              title="Delete delivery fee"
                            >

                              <Trash2
                                size={14}
                              />

                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* ========================= */}
            {/* EXPLANATION */}
            {/* ========================= */}

            <div className="mt-6 rounded-[22px] border border-neutral-800 bg-black p-5">

              <p className="text-sm text-neutral-300">
                How state delivery pricing works
              </p>

              <div className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">

                <p>
                  • An active state fee takes
                  priority over the default
                  delivery fee.
                </p>

                <p>
                  • If a state has no active
                  state-specific fee, the default
                  delivery fee is used.
                </p>

                <p>
                  • Deactivating a state fee makes
                  the store fall back to the default
                  delivery fee.
                </p>

              </div>

            </div>

          </section>

        </>

      )}

    </div>
  );
}