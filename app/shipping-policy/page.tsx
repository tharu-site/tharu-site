import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 py-24 md:px-10">

        <div className="mx-auto max-w-4xl">

          {/* HEADER */}
          <div className="border-b border-neutral-900 pb-10">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
              Legal
            </p>

            <h1 className="text-4xl font-light tracking-tight md:text-6xl">
              Shipping Policy
            </h1>

            <p className="mt-6 text-sm text-neutral-500">
              Last updated: May 11, 2026
            </p>

          </div>

          {/* CONTENT */}
          <div className="mt-14 space-y-14 text-neutral-300">

            {/* INTRO */}
            <section className="space-y-6 leading-relaxed">

              <p>
                This Shipping Policy outlines how THARU Watches
                (“THARU”, “we”, “us”, or “our”) processes and
                delivers orders placed through our website.
              </p>

              <p>
                By placing an order with THARU, you agree to
                the terms outlined in this Shipping Policy.
              </p>

            </section>

            {/* ORDER PROCESSING */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                1. Order Processing
              </h2>

              <p className="leading-relaxed">
                Orders are typically processed within 1–5
                business days after payment confirmation.
              </p>

              <p className="leading-relaxed">
                Processing times may vary during:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Product launches</li>

                <li>• Limited releases</li>

                <li>• Promotional periods</li>

                <li>• Public holidays</li>

                <li>• High order volumes</li>

              </ul>

              <p className="leading-relaxed">
                Orders placed on weekends or public holidays
                may begin processing on the next business day.
              </p>

              <p className="leading-relaxed">
                Once your order has been processed and shipped,
                you will receive a shipping confirmation
                message where applicable.
              </p>

            </section>

            {/* SHIPPING LOCATIONS */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                2. Shipping Locations
              </h2>

              <p className="leading-relaxed">
                THARU currently ships primarily within Nigeria.
              </p>

              <p className="leading-relaxed">
                International shipping may become available
                in selected regions in the future. If
                international shipping is available at
                checkout, the customer is responsible for
                reviewing any additional shipping fees,
                import duties, taxes, or customs charges
                that may apply.
              </p>

            </section>

            {/* DELIVERY */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                3. Delivery Timeframes
              </h2>

              <p className="leading-relaxed">
                Estimated delivery times may vary depending
                on location, courier operations, and external
                circumstances.
              </p>

              <div className="rounded-[28px] border border-neutral-900 bg-neutral-950 p-8">

                <h3 className="mb-6 text-xl font-light text-white">
                  Nigeria Deliveries
                </h3>

                <p className="mb-6 text-neutral-400">
                  Estimated delivery timeframe:
                </p>

                <ul className="space-y-4 text-neutral-300">

                  <li>• Abuja: 1–3 business days</li>

                  <li>• Lagos and major cities: 2–5 business days</li>

                  <li>• Other regions: 3–7 business days</li>

                </ul>

              </div>

              <p className="leading-relaxed">
                These timelines are estimates only and are
                not guaranteed.
              </p>

            </section>

            {/* SHIPPING FEES */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                4. Shipping Fees
              </h2>

              <p className="leading-relaxed">
                Shipping fees are calculated during checkout
                based on:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Delivery location</li>

                <li>• Order size and weight</li>

                <li>• Shipping method</li>

                <li>• Courier pricing</li>

              </ul>

              <p className="leading-relaxed">
                Customers will be shown shipping costs
                before completing payment.
              </p>

              <p className="leading-relaxed">
                THARU reserves the right to update shipping
                rates at any time without prior notice.
              </p>

            </section>

            {/* TRACKING */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                5. Tracking Information
              </h2>

              <p className="leading-relaxed">
                Where available, tracking details may be
                provided after an order has been shipped.
              </p>

              <p className="leading-relaxed">
                Please allow some time for tracking
                information to update after shipment
                confirmation.
              </p>

              <p className="leading-relaxed">
                THARU is not responsible for delays caused
                by courier systems or inaccurate tracking
                updates.
              </p>

            </section>

            {/* INCORRECT SHIPPING */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                6. Incorrect Shipping Information
              </h2>

              <p className="leading-relaxed">
                Customers are responsible for ensuring
                that all shipping and contact information
                provided during checkout is accurate.
              </p>

              <p className="leading-relaxed">
                THARU is not responsible for delays,
                failed deliveries, or additional charges
                resulting from:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Incorrect addresses</li>

                <li>• Incorrect phone numbers</li>

                <li>• Incomplete shipping information</li>

                <li>• Failure to receive delivery attempts</li>

              </ul>

              <p className="leading-relaxed">
                If an order is returned due to incorrect
                information provided by the customer,
                additional shipping fees may apply
                for reshipment.
              </p>

            </section>

            {/* DELAYED DELIVERIES */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                7. Delayed Deliveries
              </h2>

              <p className="leading-relaxed">
                While we work to ensure timely delivery,
                THARU is not responsible for shipping
                delays caused by circumstances outside
                our control, including:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Courier delays</li>

                <li>• Weather conditions</li>

                <li>• Public holidays</li>

                <li>• Customs processing</li>

                <li>• Strikes or transportation disruptions</li>

                <li>• Security or operational issues</li>

              </ul>

              <p className="leading-relaxed">
                Delivery dates provided are estimates only.
              </p>

            </section>

            {/* LOST PACKAGES */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                8. Lost or Stolen Packages
              </h2>

              <p className="leading-relaxed">
                Once an order has been handed over to the
                courier and marked as delivered,
                responsibility may transfer to the customer.
              </p>

              <p className="leading-relaxed">
                If you believe your package has been lost
                or stolen, please contact us promptly so
                we can assist in investigating the issue
                with the shipping provider.
              </p>

              <p className="leading-relaxed">
                THARU does not guarantee refunds or
                replacements for packages marked as
                successfully delivered by the courier.
              </p>

            </section>

            {/* FAILED DELIVERIES */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                9. Failed Delivery Attempts
              </h2>

              <p className="leading-relaxed">
                If delivery attempts fail due to customer
                unavailability or inability to receive
                the package, the courier may:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Attempt redelivery</li>

                <li>• Hold the package temporarily</li>

                <li>• Return the package to sender</li>

              </ul>

              <p className="leading-relaxed">
                Additional shipping charges may apply
                for re-delivery.
              </p>

            </section>

            {/* CUSTOMS */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                10. Customs and Import Duties
              </h2>

              <p className="leading-relaxed">
                For international orders, customers are
                responsible for any customs duties,
                import taxes, or fees imposed by
                their country.
              </p>

              <p className="leading-relaxed">
                THARU is not responsible for delays
                caused by customs clearance procedures.
              </p>

            </section>

            {/* PREORDERS */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                11. Pre-Orders and Launch Orders
              </h2>

              <p className="leading-relaxed">
                For pre-orders or launch-period purchases,
                estimated shipping timelines may differ
                from standard orders.
              </p>

              <p className="leading-relaxed">
                Expected shipping windows for pre-orders
                will be communicated on the product page
                or during checkout.
              </p>

              <p className="leading-relaxed">
                Please note that pre-order delivery
                estimates are subject to manufacturing,
                logistics, and operational timelines.
              </p>

            </section>

            {/* CONTACT */}
            <section className="rounded-[30px] border border-neutral-900 bg-neutral-950 p-8">

              <h2 className="mb-6 text-2xl font-light text-white">
                12. Contact Us
              </h2>

              <p className="mb-8 leading-relaxed text-neutral-400">
                If you have any questions regarding
                shipping or delivery, please contact us:
              </p>

              <div className="space-y-4 text-neutral-300">

                <p>
                  THARU Watches
                </p>

                <p>
                  Email:{" "}
                  <a
                    href="mailto:tharuwatch@gmail.com"
                    className="transition hover:text-white"
                  >
                    tharuwatch@gmail.com
                  </a>
                </p>

                <p>
                  Address: Block 1 Flat 4,
                  Spring Valley Estate,
                  Lugbe, Abuja, Nigeria
                </p>

              </div>

            </section>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}