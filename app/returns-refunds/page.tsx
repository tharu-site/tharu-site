// app/returns-refunds/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReturnsRefundsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white md:px-10">

        <Navbar />

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="border-b border-neutral-900 pb-10">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Legal
          </p>

          <h1 className="text-4xl font-light tracking-tight md:text-6xl">
            Return & Refund Policy
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
              At THARU, we are committed to delivering
              products that meet our standards of quality
              and design. If your order does not meet your
              expectations, we offer a return process
              subject to the conditions outlined below.
            </p>

            <p>
              Please read this policy carefully before
              initiating a return.
            </p>

          </section>

          {/* RETURN ELIGIBILITY */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              1. Return Eligibility
            </h2>

            <p className="leading-relaxed">
              You may request a return within 14 days
              from the date your order is delivered.
            </p>

            <p className="leading-relaxed">
              To qualify for a return, the following
              conditions must be met:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>
                • The item must be unworn, unused,
                and in its original condition.
              </li>

              <li>
                • All original packaging, tags,
                inserts, accessories, and protective
                materials must be included.
              </li>

              <li>
                • The item must not show signs of
                wear, damage, resizing, misuse,
                or alteration.
              </li>

              <li>
                • Proof of purchase or order
                confirmation from THARU must
                be provided.
              </li>

            </ul>

            <p className="leading-relaxed">
              Returns that do not meet these
              conditions may be rejected.
            </p>

          </section>

          {/* NON RETURNABLE */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              2. Non-Returnable Items
            </h2>

            <p className="leading-relaxed">
              The following items are not eligible
              for return or refund unless they
              arrive damaged or defective:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• Personalized or engraved products</li>

              <li>• Final sale or clearance items</li>

              <li>• Gift cards or promotional items</li>

              <li>
                • Products damaged due to misuse,
                accidents, or unauthorized
                modifications
              </li>

            </ul>

          </section>

          {/* DAMAGED ORDERS */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              3. Damaged or Incorrect Orders
            </h2>

            <p className="leading-relaxed">
              If your order arrives damaged,
              defective, or incorrect, please
              contact us within 48 hours of delivery.
            </p>

            <p className="leading-relaxed">
              To help us resolve the issue quickly,
              please include:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• Your order number</li>

              <li>• A description of the issue</li>

              <li>
                • Clear photos or videos showing
                the condition of the item and packaging
              </li>

            </ul>

            <p className="leading-relaxed">
              We reserve the right to assess reported
              issues before approving refunds,
              replacements, or exchanges.
            </p>

          </section>

          {/* RETURN PROCESS */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              4. Return Process
            </h2>

            <p className="leading-relaxed">
              To initiate a return, please contact
              our support team at:
            </p>

            <div className="rounded-[24px] border border-neutral-900 bg-neutral-950 p-6">

              <p className="text-neutral-400">
                Email:
              </p>

              <a
                href="mailto:tharuwatch@gmail.com"
                className="mt-2 inline-block text-white transition hover:text-neutral-300"
              >
                tharuwatch@gmail.com
              </a>

            </div>

            <p className="leading-relaxed">
              Your request should include:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• Full name</li>

              <li>• Order number</li>

              <li>• Reason for return</li>

              <li>• Supporting photos if applicable</li>

            </ul>

            <p className="leading-relaxed">
              If your return is approved, return
              instructions and the designated
              return address will be provided.
            </p>

            <p className="leading-relaxed">
              Please do not send products back
              without prior authorization, as
              unauthorized returns may not
              be accepted.
            </p>

          </section>

          {/* RETURN SHIPPING */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              5. Return Shipping
            </h2>

            <p className="leading-relaxed">
              Customers are responsible for return
              shipping costs unless:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• The wrong item was delivered</li>

              <li>
                • The product arrived damaged
                or defective
              </li>

              <li>
                • The return was approved due
                to an error caused by THARU
              </li>

            </ul>

            <p className="leading-relaxed">
              We strongly recommend using a
              trackable shipping method, as
              THARU is not responsible for lost
              or delayed return shipments.
            </p>

            <p className="leading-relaxed">
              Shipping fees paid during the
              original purchase are generally
              non-refundable unless otherwise stated.
            </p>

          </section>

          {/* REFUND PROCESS */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              6. Refund Process
            </h2>

            <p className="leading-relaxed">
              Once your returned item is received
              and inspected, we will notify you
              regarding the status of your refund.
            </p>

            <p className="leading-relaxed">
              If approved:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>
                • Refunds will be issued to the
                original payment method used
                during checkout.
              </li>

              <li>
                • Processing may take 3–10 business
                days depending on your bank or
                payment provider.
              </li>

              <li>
                • Bank transfer refunds may require
                additional verification.
              </li>

            </ul>

            <p className="leading-relaxed">
              If a return does not meet our
              eligibility conditions, we reserve
              the right to reject the refund request.
            </p>

          </section>

          {/* EXCHANGES */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              7. Exchanges
            </h2>

            <p className="leading-relaxed">
              At this time, exchanges are handled
              on a case-by-case basis depending
              on product availability.
            </p>

            <p className="leading-relaxed">
              If you would like to exchange an item,
              please contact us before initiating
              a return.
            </p>

          </section>

          {/* ORDER CANCELLATIONS */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              8. Order Cancellations
            </h2>

            <p className="leading-relaxed">
              Orders may only be canceled before
              they have been processed or shipped.
            </p>

            <p className="leading-relaxed">
              Once an order has been shipped,
              it cannot be canceled and must
              instead follow the return process
              outlined in this policy.
            </p>

          </section>

          {/* INTERNATIONAL */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              9. International Orders
            </h2>

            <p className="leading-relaxed">
              THARU currently primarily serves
              customers within Nigeria. As
              international shipping becomes
              available, additional duties,
              taxes, customs fees, and shipping
              timelines may apply depending
              on destination country.
            </p>

            <p className="leading-relaxed">
              Customers are responsible for any
              applicable customs charges unless
              otherwise stated.
            </p>

          </section>

          {/* FRAUD */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              10. Fraud Prevention
            </h2>

            <p className="leading-relaxed">
              THARU reserves the right to refuse
              returns, refunds, or cancellations
              in cases involving suspected fraud,
              abuse of policy, chargeback misuse,
              or suspicious activity.
            </p>

          </section>

          {/* CONTACT */}
          <section className="rounded-[30px] border border-neutral-900 bg-neutral-950 p-8">

            <h2 className="mb-6 text-2xl font-light text-white">
              11. Contact Us
            </h2>

            <p className="mb-8 leading-relaxed text-neutral-400">
              If you have any questions regarding
              this Return & Refund Policy,
              please contact us:
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

          <Footer />

        </div>

      </div>

    </main>
  );
}