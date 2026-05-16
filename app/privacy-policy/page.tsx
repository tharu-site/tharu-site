import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              This Privacy Policy describes how THARU Watches
              ("THARU", the "Site", "we", "us", or "our")
              collects, uses, stores, and discloses your personal
              information when you visit, use our services,
              make a purchase from our website, or otherwise
              interact with us (collectively, the "Services").
            </p>

            <p>
              For the purposes of this Privacy Policy, "you"
              and "your" refers to any user of the Services,
              including customers, visitors, and individuals
              whose personal information we collect.
            </p>

            <p>
              By accessing or using any part of the Services,
              you agree to the collection, use, and disclosure
              of your information in accordance with this
              Privacy Policy. If you do not agree with this
              Privacy Policy, please do not use the Services.
            </p>

          </section>

          {/* CHANGES */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Changes to This Privacy Policy
            </h2>

            <p className="leading-relaxed">
              We may update this Privacy Policy from time to
              time to reflect changes to our business
              operations, legal obligations, technologies,
              or Services.
            </p>

            <p className="leading-relaxed">
              Any changes will be posted on this page with
              an updated “Last updated” date. Your continued
              use of the Services after such changes
              constitutes acceptance of the revised
              Privacy Policy.
            </p>

          </section>

          {/* INFORMATION WE COLLECT */}
          <section className="space-y-8">

            <h2 className="text-2xl font-light text-white">
              Information We Collect
            </h2>

            <p className="leading-relaxed">
              The types of personal information we collect
              depend on how you interact with our Services.
            </p>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Information You Provide Directly
              </h3>

              <p className="leading-relaxed">
                We may collect personal information you
                voluntarily provide to us, including:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Full name</li>
                <li>• Email address</li>
                <li>• Phone number</li>
                <li>• Billing address</li>
                <li>• Shipping address</li>
                <li>• Payment confirmation details</li>
                <li>• Order information</li>
                <li>• Customer support messages and communication records</li>
                <li>• Any information you provide when contacting us or placing an order</li>

              </ul>

              <p className="leading-relaxed">
                Providing certain information may be necessary
                to access some features of the Services or
                complete purchases.
              </p>

            </div>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Payment Information
              </h3>

              <p className="leading-relaxed">
                Payments made through the Services may be
                processed by third-party payment providers
                such as Paystack.
              </p>

              <p className="leading-relaxed">
                We do not directly store or have full access
                to your debit card, credit card, or banking
                credentials.
              </p>

              <p className="leading-relaxed">
                Payment providers may collect:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Payment card information</li>
                <li>• Bank details</li>
                <li>• Billing information</li>
                <li>• Transaction verification data</li>

              </ul>

              <p className="leading-relaxed">
                Such information is processed according to
                the payment provider’s own privacy and
                security policies.
              </p>

            </div>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Information Collected Automatically
              </h3>

              <p className="leading-relaxed">
                We may automatically collect certain
                information about your device and interaction
                with the Services (“Usage Data”).
              </p>

              <p className="leading-relaxed">
                This may include:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• IP address</li>
                <li>• Browser type</li>
                <li>• Device type</li>
                <li>• Operating system</li>
                <li>• Pages viewed</li>
                <li>• Time spent on pages</li>
                <li>• Website interaction data</li>
                <li>• Referral source</li>
                <li>• General location information based on IP address</li>

              </ul>

              <p className="leading-relaxed">
                We may use cookies, analytics tools, pixels,
                and similar technologies to collect this
                information.
              </p>

            </div>

          </section>

          {/* COOKIES */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Cookies and Tracking Technologies
            </h2>

            <p className="leading-relaxed">
              Like many websites, we use cookies and similar
              technologies to improve user experience,
              understand site usage, and support website
              functionality.
            </p>

            <p className="leading-relaxed">
              Cookies may be used to:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• Remember preferences</li>
              <li>• Maintain shopping cart sessions</li>
              <li>• Analyze website traffic</li>
              <li>• Improve website performance</li>
              <li>• Support marketing and advertising activities</li>

            </ul>

            <p className="leading-relaxed">
              Most web browsers accept cookies automatically.
              You may disable cookies through your browser
              settings, although doing so may affect website
              functionality.
            </p>

          </section>

          {/* HOW WE USE */}
          <section className="space-y-8">

            <h2 className="text-2xl font-light text-white">
              How We Use Your Information
            </h2>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Order Fulfillment
              </h3>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Processing and confirming orders</li>
                <li>• Arranging shipping and delivery</li>
                <li>• Managing returns and exchanges</li>
                <li>• Providing customer service</li>
                <li>• Sending order updates and transactional communications</li>

              </ul>

            </div>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Website Operations and Improvement
              </h3>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Operating and maintaining the Services</li>
                <li>• Improving website functionality and user experience</li>
                <li>• Monitoring analytics and usage patterns</li>
                <li>• Troubleshooting technical issues</li>

              </ul>

            </div>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Marketing and Communication
              </h3>

              <p className="leading-relaxed">
                We may use your information to send:
              </p>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Promotional emails</li>
                <li>• Product updates</li>
                <li>• Launch announcements</li>
                <li>• Marketing communications</li>
                <li>• Brand news and offers</li>

              </ul>

              <p className="leading-relaxed">
                You may unsubscribe from marketing
                communications at any time.
              </p>

            </div>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Fraud Prevention and Security
              </h3>

              <ul className="space-y-3 pl-6 text-neutral-400">

                <li>• Detect unauthorized activity</li>
                <li>• Prevent fraud and abuse</li>
                <li>• Verify transactions</li>
                <li>• Protect our rights, customers, and Services</li>

              </ul>

            </div>

            <div className="space-y-5">

              <h3 className="text-xl font-light text-white">
                Legal Compliance
              </h3>

              <p className="leading-relaxed">
                We may process information where necessary
                to comply with legal obligations, enforce
                our policies, or respond to lawful requests.
              </p>

            </div>

          </section>

          {/* SHARING */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Sharing of Information
            </h2>

            <p className="leading-relaxed">
              We may share personal information with trusted
              third parties where necessary to operate the
              Services.
            </p>

            <p className="leading-relaxed">
              These may include:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• Payment processors</li>
              <li>• Shipping and logistics providers</li>
              <li>• Hosting providers</li>
              <li>• Analytics providers</li>
              <li>• Customer support tools</li>
              <li>• Marketing and advertising partners</li>
              <li>• Professional advisers and legal authorities where required</li>

            </ul>

            <p className="leading-relaxed">
              We do not sell your personal information to
              third parties.
            </p>

          </section>

          {/* INTERNATIONAL */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              International Transfers
            </h2>

            <p className="leading-relaxed">
              Although THARU currently operates primarily
              within Nigeria, some third-party service
              providers we use may process or store data
              outside Nigeria.
            </p>

            <p className="leading-relaxed">
              By using the Services, you acknowledge that
              your information may be transferred to and
              processed in countries outside your country
              of residence.
            </p>

            <p className="leading-relaxed">
              We take reasonable steps to ensure appropriate
              safeguards are in place for such transfers.
            </p>

          </section>

          {/* DATA RETENTION */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Data Retention
            </h2>

            <p className="leading-relaxed">
              We retain personal information only for as long
              as reasonably necessary to:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• Fulfill orders and provide Services</li>
              <li>• Maintain business records</li>
              <li>• Comply with legal obligations</li>
              <li>• Resolve disputes</li>
              <li>• Enforce agreements and policies</li>

            </ul>

            <p className="leading-relaxed">
              Retention periods may vary depending on the
              nature of the information and applicable legal
              requirements.
            </p>

          </section>

          {/* SECURITY */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Security
            </h2>

            <p className="leading-relaxed">
              We implement reasonable administrative,
              technical, and organizational measures to
              help protect your personal information.
            </p>

            <p className="leading-relaxed">
              However, no method of electronic storage or
              internet transmission is completely secure,
              and we cannot guarantee absolute security.
            </p>

            <p className="leading-relaxed">
              You are responsible for maintaining the
              confidentiality of your own devices and
              communications.
            </p>

          </section>

          {/* RIGHTS */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Your Rights
            </h2>

            <p className="leading-relaxed">
              Depending on your location and applicable laws,
              you may have rights relating to your personal
              information, including:
            </p>

            <ul className="space-y-3 pl-6 text-neutral-400">

              <li>• The right to access information we hold about you</li>
              <li>• The right to request correction of inaccurate information</li>
              <li>• The right to request deletion of your information</li>
              <li>• The right to object to certain processing activities</li>
              <li>• The right to withdraw consent where processing is based on consent</li>
              <li>• The right to request information regarding how your data is used</li>

            </ul>

            <p className="leading-relaxed">
              To exercise any of these rights, please contact
              us using the contact details below.
            </p>

          </section>

          {/* THIRD PARTY */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Third-Party Links
            </h2>

            <p className="leading-relaxed">
              Our website may contain links to third-party
              websites or services.
            </p>

            <p className="leading-relaxed">
              We are not responsible for the privacy
              practices, content, or security of third-party
              websites.
            </p>

            <p className="leading-relaxed">
              We encourage you to review the privacy policies
              of any third-party sites you visit.
            </p>

          </section>

          {/* CHILDREN */}
          <section className="space-y-6">

            <h2 className="text-2xl font-light text-white">
              Children’s Privacy
            </h2>

            <p className="leading-relaxed">
              The Services are not intended for individuals
              under the age of 13.
            </p>

            <p className="leading-relaxed">
              We do not knowingly collect personal information
              from children.
            </p>

            <p className="leading-relaxed">
              If you believe a child has provided us with
              personal information, please contact us so we
              can take appropriate action.
            </p>

          </section>

          {/* CONTACT */}
          <section className="space-y-6 rounded-[30px] border border-neutral-900 bg-neutral-950 p-8">

            <h2 className="text-2xl font-light text-white">
              Contact Us
            </h2>

            <p className="leading-relaxed">
              If you have any questions, requests, or concerns
              regarding this Privacy Policy or our privacy
              practices, you may contact us at:
            </p>

            <div className="space-y-3 text-neutral-400">

              <p>THARU Watches</p>

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
                Address: Block 1 Flat 4, Spring Valley Estate,
                Lugbe, Abuja, Nigeria
              </p>

            </div>

          </section>

          {/* CONSENT */}
          <section className="border-t border-neutral-900 pt-10">

            <h2 className="mb-5 text-2xl font-light text-white">
              Consent
            </h2>

            <p className="leading-relaxed text-neutral-400">
              By accessing or using our Services, you
              acknowledge that you have read, understood,
              and agreed to this Privacy Policy.
            </p>

          </section>

          <Footer />

        </div>

      </div>

    </main>
  );
}