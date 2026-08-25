import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      <Navbar />

      <section className="px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mx-auto mb-16 max-w-3xl text-center">

            <p className="mb-5 text-sm uppercase tracking-[0.4em] text-neutral-500">
              THARU
            </p>

            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              Share Your Experience
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
              Every THARU watch becomes part of someone's story.
              Tell us about yours.
            </p>

          </div>

          {/* FORM */}

          <ReviewForm />

        </div>

      </section>

      <Footer />

    </main>
  );
}