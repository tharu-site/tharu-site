"use client";

import { useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useCart } from "@/components/CartContext";

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

  const [message, setMessage] =
    useState("");

  /* TOTAL */
  const total = useMemo(() => {

    return cart.reduce((acc, item) => {

      const numericPrice = Number(
        item.price.replace(/[₦,]/g, "")
      );

      return (
        acc +
        numericPrice * item.quantity
      );

    }, 0);

  }, [cart]);

  const publicKey =
    process.env
      .NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  /* VALIDATE FORM */
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

    return true;
  };

  /* HANDLE PAYMENT */
  const handlePayment =
    async () => {

      const isValid =
        validateForm();

      if (!isValid) return;

      try {

        setLoading(true);

        setMessage("");

        /* SEND ORDER DETAILS */
        const response =
          await fetch(
            "/api/checkout",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
                firstName,
                lastName,
                phone,
                address,
                country,
                state,
                cart,
                total,
              }),
            }
          );

        if (!response.ok) {

          setMessage(
            "Something went wrong. Please try again."
          );

          setLoading(false);

          return;
        }

        /* ONLY RUN IN BROWSER */
        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        /* LOAD PAYSTACK */
        const PaystackPop = (
  await import(
    "@paystack/inline-js"
  )
).default;

const popup =
  new PaystackPop();

        popup.newTransaction({

          key: publicKey,

          email,

          amount: total * 100,

          currency: "NGN",

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
            ],
          },

         onSuccess(transaction: any) {

  clearCart();

  window.location.href =
    `/success?reference=${transaction.reference}` +
    `&email=${email}` +
    `&amount=${total}` +
    `&firstName=${firstName}` +
    `&state=${state}`;
},

          onCancel() {

            setMessage(
              "Payment cancelled."
            );
          },
        });

      } catch {

        setMessage(
          "Unable to initialize payment."
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-4 pt-28 pb-20 md:px-6 md:pt-32">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div>

            <h1 className="mb-10 text-4xl font-light md:text-6xl">
              Checkout
            </h1>

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

              {/* MESSAGE */}
              {message && (

                <div className="rounded-[24px] border border-neutral-800 bg-neutral-950 px-6 py-5 text-sm text-neutral-300">

                  {message}

                </div>

              )}

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-[32px] border border-neutral-900 bg-neutral-950 p-8">

            <h2 className="text-2xl font-light">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5">

              {cart.map((item) => (
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
              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-10 flex items-center justify-between text-xl">

              <p>Total</p>

              <p>
                ₦
                {total.toLocaleString()}
              </p>

            </div>

            {/* BUTTON */}
            <div className="mt-10">

              <button
                onClick={
                  handlePayment
                }
                disabled={loading}
                className="h-14 w-full rounded-full bg-white text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 disabled:opacity-50"
              >

                {loading
                  ? "Processing..."
                  : "Complete Payment"}

              </button>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}// update
