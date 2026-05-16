import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
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
              Terms of Service
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
                These Terms of Service (“Terms”) govern your
                access to and use of the THARU Watches website,
                products, and services (collectively,
                the “Services”).
              </p>

              <p>
                Throughout these Terms, “THARU”, “we”, “us”,
                and “our” refer to THARU Watches.
              </p>

              <p>
                By accessing our website, purchasing products,
                or using any part of the Services, you agree
                to be bound by these Terms. If you do not agree
                to these Terms, you should not access or use
                the Services.
              </p>

            </section>

            {/* ELIGIBILITY */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                1. Eligibility
              </h2>

              <p className="leading-relaxed">
                By using the Services, you confirm that:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>
                  • You are at least 18 years old or have
                  permission from a parent or legal guardian.
                </li>

                <li>
                  • You are legally capable of entering
                  into binding agreements.
                </li>

                <li>
                  • The information you provide is accurate
                  and complete.
                </li>

              </ul>

              <p className="leading-relaxed">
                THARU reserves the right to refuse service,
                cancel orders, or terminate access where
                necessary.
              </p>

            </section>

            {/* PRODUCTS */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                2. Products and Availability
              </h2>

              <p className="leading-relaxed">
                THARU products are subject to availability.
              </p>

              <p className="leading-relaxed">
                We reserve the right to:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Modify or discontinue products without notice</li>

                <li>• Limit product quantities</li>

                <li>• Refuse or cancel orders</li>

                <li>• Correct pricing or product description errors</li>

              </ul>

              <p className="leading-relaxed">
                We make reasonable efforts to display
                products accurately, including colors and
                materials. However, actual appearance may
                vary depending on device screens, lighting,
                photography, or manufacturing variations.
              </p>

            </section>

            {/* PRICING */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                3. Pricing and Payments
              </h2>

              <p className="leading-relaxed">
                All prices displayed are listed in Nigerian
                Naira (₦) unless otherwise stated.
              </p>

              <p className="leading-relaxed">
                We reserve the right to change pricing
                at any time without prior notice.
              </p>

              <p className="leading-relaxed">
                Accepted payment methods may include:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Paystack-supported payments</li>

                <li>• Bank transfers</li>

                <li>• Other approved payment methods listed during checkout</li>

              </ul>

              <p className="leading-relaxed">
                Orders will not be processed until payment
                has been successfully confirmed.
              </p>

              <p className="leading-relaxed">
                THARU reserves the right to cancel or refuse
                orders suspected of fraud, unauthorized
                activity, pricing errors, or abuse of
                the Services.
              </p>

            </section>

            {/* ORDER ACCEPTANCE */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                4. Order Acceptance
              </h2>

              <p className="leading-relaxed">
                Placing an order does not guarantee acceptance.
              </p>

              <p className="leading-relaxed">
                Once an order is placed:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• You may receive an order confirmation email.</li>

                <li>• Additional verification may be required before shipment.</li>

                <li>• THARU may cancel orders at its discretion where necessary.</li>

              </ul>

              <p className="leading-relaxed">
                If an order is canceled after payment has
                been received, an appropriate refund may
                be issued.
              </p>

            </section>

            {/* SHIPPING */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                5. Shipping and Delivery
              </h2>

              <p className="leading-relaxed">
                Shipping timelines provided are estimates only.
              </p>

              <p className="leading-relaxed">
                THARU is not responsible for delays caused by:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Courier services</li>

                <li>• Customs processing</li>

                <li>• Weather conditions</li>

                <li>• Operational disruptions</li>

                <li>• Incorrect customer information</li>

              </ul>

              <p className="leading-relaxed">
                Customers are responsible for providing
                accurate shipping information during checkout.
              </p>

              <p className="leading-relaxed">
                Additional terms relating to delivery are
                outlined in our Shipping Policy.
              </p>

            </section>

            {/* RETURNS */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                6. Returns and Refunds
              </h2>

              <p className="leading-relaxed">
                Returns and refunds are governed by our
                Return & Refund Policy.
              </p>

              <p className="leading-relaxed">
                By placing an order, you acknowledge and
                agree to the conditions outlined in
                that policy.
              </p>

            </section>

            {/* WARRANTY */}
            <section className="space-y-8">

              <h2 className="text-2xl font-light text-white">
                7. One-Year Limited Warranty
              </h2>

              <p className="leading-relaxed">
                THARU watches include a limited warranty
                valid for one (1) year from the original
                date of delivery.
              </p>

              <p className="leading-relaxed">
                This warranty covers manufacturing defects
                in materials or workmanship under normal use.
              </p>

              <div className="space-y-5">

                <h3 className="text-xl font-light text-white">
                  Warranty Coverage
                </h3>

                <p className="leading-relaxed">
                  The warranty may cover:
                </p>

                <ul className="space-y-3 pl-6 text-neutral-400">

                  <li>• Movement defects</li>

                  <li>• Manufacturing faults</li>

                  <li>• Functional issues resulting from production defects</li>

                </ul>

              </div>

              <div className="space-y-5">

                <h3 className="text-xl font-light text-white">
                  Warranty Exclusions
                </h3>

                <p className="leading-relaxed">
                  The warranty does not cover:
                </p>

                <ul className="space-y-3 pl-6 text-neutral-400">

                  <li>• Normal wear and tear</li>

                  <li>• Scratches, dents, fading, or cosmetic damage</li>

                  <li>• Damage caused by accidents, misuse, negligence, or improper handling</li>

                  <li>• Water damage resulting from misuse or use beyond stated water resistance limits</li>

                  <li>• Damage caused by unauthorized repairs or modifications</li>

                  <li>• Strap wear, battery depletion, or consumable parts unless caused by manufacturing defects</li>

                  <li>• Damage resulting from impact, drops, or improper storage</li>

                </ul>

              </div>

              <p className="leading-relaxed">
                To request warranty support, customers
                may be required to provide:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Proof of purchase</li>

                <li>• Order number</li>

                <li>• Photos or videos of the issue</li>

              </ul>

              <p className="leading-relaxed">
                THARU reserves the right to inspect products
                before approving warranty claims.
              </p>

              <p className="leading-relaxed">
                Where applicable, THARU may choose to:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Repair the product</li>

                <li>• Replace the product</li>

                <li>• Offer partial store credit</li>

                <li>• Decline claims that fall outside warranty coverage</li>

              </ul>

              <p className="leading-relaxed">
                Customers may be responsible for shipping
                costs associated with warranty claims unless
                otherwise stated.
              </p>

            </section>

            {/* INTELLECTUAL PROPERTY */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                8. Intellectual Property
              </h2>

              <p className="leading-relaxed">
                All content on the Services, including but
                not limited to:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Logos</li>

                <li>• Product designs</li>

                <li>• Website design</li>

                <li>• Text</li>

                <li>• Graphics</li>

                <li>• Images</li>

                <li>• Videos</li>

                <li>• Branding materials</li>

              </ul>

              <p className="leading-relaxed">
                is owned by or licensed to THARU and
                protected by applicable intellectual
                property laws.
              </p>

              <p className="leading-relaxed">
                You may not reproduce, distribute,
                modify, or commercially use any content
                without prior written permission from THARU.
              </p>

            </section>

            {/* USER CONDUCT */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                9. User Conduct
              </h2>

              <p className="leading-relaxed">
                You agree not to:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Use the Services for unlawful purposes</li>

                <li>• Interfere with website security or operations</li>

                <li>• Attempt unauthorized access to systems or accounts</li>

                <li>• Submit false information</li>

                <li>• Abuse, exploit, or misuse the Services</li>

              </ul>

              <p className="leading-relaxed">
                THARU reserves the right to suspend or
                terminate access where violations occur.
              </p>

            </section>

            {/* THIRD PARTY */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                10. Third-Party Services
              </h2>

              <p className="leading-relaxed">
                The Services may contain links to third-party
                websites, tools, or services.
              </p>

              <p className="leading-relaxed">
                THARU is not responsible for the content,
                policies, or practices of third-party services.
              </p>

              <p className="leading-relaxed">
                Your use of third-party services is at your own risk.
              </p>

            </section>

            {/* LIABILITY */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                11. Limitation of Liability
              </h2>

              <p className="leading-relaxed">
                To the maximum extent permitted by law,
                THARU shall not be liable for:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Indirect or consequential damages</li>

                <li>• Loss of profits or revenue</li>

                <li>• Loss of data</li>

                <li>• Delayed deliveries</li>

                <li>• Third-party service failures</li>

                <li>• Damages resulting from misuse of products</li>

              </ul>

              <p className="leading-relaxed">
                Our total liability relating to any product
                or order shall not exceed the amount paid
                for the relevant product.
              </p>

            </section>

            {/* INDEMNIFICATION */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                12. Indemnification
              </h2>

              <p className="leading-relaxed">
                You agree to indemnify and hold harmless
                THARU, its affiliates, directors,
                employees, and partners from claims,
                liabilities, damages, costs, or expenses
                arising from:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Your use of the Services</li>

                <li>• Violation of these Terms</li>

                <li>• Violation of applicable laws</li>

                <li>• Misuse of products or website content</li>

              </ul>

            </section>

            {/* PRIVACY */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                13. Privacy
              </h2>

              <p className="leading-relaxed">
                Your use of the Services is also governed
                by our Privacy Policy.
              </p>

              <p className="leading-relaxed">
                By using the Services, you consent to the
                collection and processing of information
                as described in that policy.
              </p>

            </section>

            {/* CHANGES */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                14. Changes to These Terms
              </h2>

              <p className="leading-relaxed">
                THARU reserves the right to update or
                modify these Terms at any time.
              </p>

              <p className="leading-relaxed">
                Changes will become effective once posted
                on the website.
              </p>

              <p className="leading-relaxed">
                Your continued use of the Services after
                updates constitutes acceptance of the
                revised Terms.
              </p>

            </section>

            {/* LAW */}
            <section className="space-y-6">

              <h2 className="text-2xl font-light text-white">
                15. Governing Law
              </h2>

              <p className="leading-relaxed">
                These Terms shall be governed by and
                interpreted in accordance with the laws
                of the Federal Republic of Nigeria.
              </p>

              <p className="leading-relaxed">
                Any disputes arising from the Services
                shall be subject to the jurisdiction
                of the appropriate courts in Nigeria.
              </p>

            </section>

            {/* CONTACT */}
            <section className="rounded-[30px] border border-neutral-900 bg-neutral-950 p-8">

              <h2 className="mb-6 text-2xl font-light text-white">
                16. Contact Us
              </h2>

              <p className="mb-8 leading-relaxed text-neutral-400">
                If you have any questions regarding
                these Terms, please contact us:
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