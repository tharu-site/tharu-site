"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useCart } from "@/components/CartContext";
import { supabase } from "@/lib/supabase";

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

type StoreSettings = {
  delivery_fee: number;
  accepting_orders: boolean;
  currency: string;
};

type DeliveryFee = {
  state: string;
  fee: number;
  active: boolean;
};

export default function CheckoutPage() {
  const {
    cart,
    clearCart,
  } = useCart();

  const [email, setEmail] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [country, setCountry] =
    useState("Nigeria");

  const [state, setState] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [settingsLoading, setSettingsLoading] =
    useState(true);

  const [deliveryFeesLoading, setDeliveryFeesLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [storeSettings, setStoreSettings] =
    useState<StoreSettings | null>(null);

  const [deliveryFees, setDeliveryFees] =
    useState<DeliveryFee[]>([]);

  /*
   * LOAD STORE SETTINGS
   */

  useEffect(() => {
    const loadSettings = async () => {
      setSettingsLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("store_settings")
        .select(
          "delivery_fee, accepting_orders, currency"
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Checkout settings error:",
          error
        );

        setMessage(
          "Unable to load store settings."
        );

        setSettingsLoading(false);

        return;
      }

      if (!data) {
        setMessage(
          "Store settings are not configured."
        );

        setSettingsLoading(false);

        return;
      }

      setStoreSettings(data);

      setSettingsLoading(false);
    };

    loadSettings();
  }, []);

  /*
   * LOAD STATE DELIVERY FEES
   */

  useEffect(() => {
    const loadDeliveryFees = async () => {
      setDeliveryFeesLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("delivery_fees")
        .select(
          "state, fee, active"
        )
        .eq("active", true);

      if (error) {
        console.error(
          "Delivery fees error:",
          error
        );

        /*
         * Do not break checkout if
         * state delivery fees cannot
         * be loaded.
         *
         * The default store delivery
         * fee will be used instead.
         */

        setDeliveryFees([]);

        setDeliveryFeesLoading(false);

        return;
      }

      setDeliveryFees(
        (data || []).map(
          (item) => ({
            state: String(
              item.state
            ).trim(),

            fee: Number(
              item.fee
            ),

            active:
              Boolean(
                item.active
              ),
          })
        )
      );

      setDeliveryFeesLoading(false);
    };

    loadDeliveryFees();
  }, []);

  /*
   * SUBTOTAL
   */

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const numericPrice =
          Number(
            String(item.price).replace(
              /[₦,]/g,
              ""
            )
          );

        return (
          acc +
          numericPrice *
            item.quantity
        );
      },
      0
    );
  }, [cart]);

  /*
   * SELECTED STATE DELIVERY FEE
   *
   * The selected state gets its
   * own delivery fee if one exists.
   *
   * Otherwise we use the default
   * delivery fee from store_settings.
   */

  const selectedStateFee =
    useMemo(() => {
      if (!state) {
        return null;
      }

      const normalizedState =
        state
          .trim()
          .toLowerCase();

      const matchingFee =
        deliveryFees.find(
          (item) =>
            item.active &&
            item.state
              .trim()
              .toLowerCase() ===
              normalizedState
        );

      if (!matchingFee) {
        return null;
      }

      return Number(
        matchingFee.fee
      );
    }, [
      state,
      deliveryFees,
    ]);

  /*
   * DELIVERY FEE
   */

  const deliveryFee =
    selectedStateFee !== null
      ? selectedStateFee
      : Number(
          storeSettings?.delivery_fee ?? 0
        );

  /*
   * TOTAL
   */

  const total =
    subtotal + deliveryFee;

  /*
   * PAYSTACK PUBLIC KEY
   */

  const publicKey =
    process.env
      .NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    "";

  /*
   * VALIDATE FORM
   */

  const validateForm = () => {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !state
    ) {
      setMessage(
        "Please fill all required checkout fields."
      );

      return false;
    }

    if (cart.length === 0) {
      setMessage(
        "Your cart is empty."
      );

      return false;
    }

    return true;
  };

  /*
   * HANDLE PAYMENT
   */

  const handlePayment =
    async () => {
      if (
        settingsLoading ||
        deliveryFeesLoading
      ) {
        setMessage(
          "Please wait while checkout settings load."
        );

        return;
      }

      if (!storeSettings) {
        setMessage(
          "Store settings are unavailable."
        );

        return;
      }

      /*
       * CHECK WHETHER STORE IS
       * ACCEPTING ORDERS
       */

      if (
        !storeSettings.accepting_orders
      ) {
        setMessage(
          "Orders are currently paused. Please try again later."
        );

        return;
      }

      const isValid =
        validateForm();

      if (!isValid) return;

      if (!publicKey) {
        setMessage(
          "Payment configuration is missing."
        );

        return;
      }

      try {
        setLoading(true);
        setMessage("");

        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        /*
         * LOAD PAYSTACK
         */

        const PaystackPop =
          (
            await import(
              "@paystack/inline-js"
            )
          ).default;

        const popup =
          new PaystackPop();

        /*
         * START PAYMENT
         */

        popup.newTransaction({
          key: publicKey,

          email,

          amount:
            Math.round(
              total * 100
            ),

          currency:
            storeSettings.currency ||
            "NGN",

          firstname:
            firstName,

          lastname:
            lastName,

          phone,

          metadata: {
            custom_fields: [
              {
                display_name:
                  "Address",

                variable_name:
                  "address",

                value:
                  address,
              },

              {
                display_name:
                  "State",

                variable_name:
                  "state",

                value:
                  state,
              },

              {
                display_name:
                  "Delivery Fee",

                variable_name:
                  "delivery_fee",

                value:
                  deliveryFee.toString(),
              },
            ],
          },

          async onSuccess(
            transaction: any
          ) {
            try {
              /*
               * SEND ORDER TO SERVER
               */

              const response =
                await fetch(
                  "/api/checkout",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
                        email,
                        firstName,
                        lastName,
                        phone,
                        address,
                        country,
                        state,
                        cart,

                        /*
                         * These values are
                         * informational.
                         *
                         * The server independently
                         * calculates the actual
                         * delivery fee.
                         */

                        subtotal,
                        deliveryFee,
                        total,

                        reference:
                          transaction.reference,
                      }),
                  }
                );

              const result =
                await response.json();

              if (!response.ok) {
                throw new Error(
                  result.error ||
                    "Unable to create order."
                );
              }

              clearCart();

              window.location.href =
                `/success?reference=${transaction.reference}` +
                `&email=${encodeURIComponent(
                  email
                )}` +
                `&amount=${result.total || total}` +
                `&firstName=${encodeURIComponent(
                  firstName
                )}` +
                `&state=${encodeURIComponent(
                  state
                )}`;
            } catch (
              checkoutError
            ) {
              console.error(
                "Checkout confirmation error:",
                checkoutError
              );

              setMessage(
                checkoutError instanceof
                  Error
                  ? checkoutError.message
                  : "Payment succeeded but confirmation failed."
              );
            }
          },

          onCancel() {
            setMessage(
              "Payment cancelled."
            );
          },
        });
      } catch (
        paymentError
      ) {
        console.error(
          "Payment initialization error:",
          paymentError
        );

        setMessage(
          "Unable to initialize payment."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * STORE NOT ACCEPTING ORDERS
   */

  const ordersPaused =
    storeSettings &&
    !storeSettings.accepting_orders;

  /*
   * WHETHER THE CUSTOMER HAS
   * A CUSTOM STATE FEE
   */

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-4 pb-20 pt-28 md:px-6 md:pt-32">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <h1 className="mb-10 text-4xl font-light md:text-6xl">
              Checkout
            </h1>

            {/* SETTINGS LOADING */}

            {settingsLoading && (
              <div className="mb-6 rounded-[24px] border border-neutral-800 bg-neutral-950 px-6 py-5 text-sm text-neutral-500">
                Loading checkout settings...
              </div>
            )}

            {/* DELIVERY FEES LOADING */}

            {!settingsLoading &&
              deliveryFeesLoading && (
                <div className="mb-6 rounded-[24px] border border-neutral-800 bg-neutral-950 px-6 py-5 text-sm text-neutral-500">
                  Loading delivery rates...
                </div>
              )}

            {/* ORDERS PAUSED */}

            {ordersPaused && (
              <div className="mb-6 rounded-[24px] border border-red-900 bg-red-950/20 px-6 py-5">

                <p className="text-sm text-red-400">
                  Orders are currently paused.
                </p>

                <p className="mt-2 text-xs text-neutral-500">
                  Please check back later.
                </p>

              </div>
            )}

            <div className="space-y-5">

              {/* EMAIL */}

              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
              />

              {/* NAME */}

              <div className="grid gap-4 md:grid-cols-2">

                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(
                      e.target.value
                    )
                  }
                  className="h-14 rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
                />

                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(
                      e.target.value
                    )
                  }
                  className="h-14 rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
                />

              </div>

              {/* PHONE */}

              <input
                type="text"
                required
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
              />

              {/* ADDRESS */}

              <input
                type="text"
                required
                placeholder="Address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
              />

              {/* COUNTRY */}

              <select
                value={country}
                onChange={(e) =>
                  setCountry(
                    e.target.value
                  )
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
              >
                <option value="Nigeria">
                  Nigeria
                </option>
              </select>

              {/* STATE */}

              <select
                required
                value={state}
                onChange={(e) =>
                  setState(
                    e.target.value
                  )
                }
                className="h-14 w-full rounded-full border border-neutral-800 bg-neutral-950 px-6 outline-none transition focus:border-white"
              >
                <option value="">
                  Select State
                </option>

                {nigerianStates.map(
                  (
                    stateName
                  ) => (
                    <option
                      key={stateName}
                      value={
                        stateName
                      }
                    >
                      {stateName}
                    </option>
                  )
                )}
              </select>

              {/* STATE DELIVERY INFORMATION */}

              {state && (
                <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 px-6 py-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Delivery to
                      </p>

                      <p className="mt-2 text-sm text-white">
                        {state}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Delivery Fee
                      </p>

                      <p className="mt-2 text-lg text-white">
                        ₦
                        {deliveryFee.toLocaleString(
                          "en-NG"
                        )}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* MESSAGE */}

              {message && (
                <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 px-6 py-5 text-sm text-neutral-300">
                  {message}
                </div>
              )}

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-[32px] border border-neutral-900 bg-neutral-950 p-8">

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
              Nationwide Delivery
            </p>

            <h2 className="text-2xl font-light">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5">

              {cart.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-neutral-800 pb-5"
                  >

                    <div>

                      <p className="text-lg">
                        {item.name}
                      </p>

                      <p className="text-sm text-neutral-500">
                        Qty:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <p>
                      {item.price}
                    </p>

                  </div>
                )
              )}

            </div>

            {/* SUBTOTAL */}

            <div className="mt-10 flex items-center justify-between border-b border-neutral-800 pb-4">

              <p>
                Subtotal
              </p>

              <p>
                ₦
                {subtotal.toLocaleString(
                  "en-NG"
                )}
              </p>

            </div>

            {/* DELIVERY */}

            <div className="mt-4 flex items-center justify-between border-b border-neutral-800 pb-4">

              <div>

                <p>
                  Delivery Fee
                </p>

                {state && (
                  <p className="mt-1 text-xs text-neutral-500">
                    {state}
                  </p>
                )}

              </div>

              <p>
                ₦
                {deliveryFee.toLocaleString(
                  "en-NG"
                )}
              </p>

            </div>

            {/* TOTAL */}

            <div className="mt-4 flex items-center justify-between text-xl">

              <p>
                Total
              </p>

              <p>
                ₦
                {total.toLocaleString(
                  "en-NG"
                )}
              </p>

            </div>

            {/* DELIVERY NOTICE */}

            <p className="mt-8 text-center text-sm uppercase tracking-[0.2em] text-neutral-400">
            Delivery takes{" "}
            <span className="font-medium text-white">
              3–5 business days
            </span>
            .
          </p>

            {/* BUTTON */}

            <div className="mt-10">

              <button
                onClick={
                  handlePayment
                }
                disabled={
                  loading ||
                  settingsLoading ||
                  deliveryFeesLoading ||
                  !storeSettings ||
                  Boolean(
                    ordersPaused
                  ) ||
                  cart.length === 0
                }
                className="h-14 w-full rounded-full bg-white text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : ordersPaused
                  ? "Orders Paused"
                  : "Complete Payment"}
              </button>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}