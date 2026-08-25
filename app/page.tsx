import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FirstRun from "@/components/FirstRun";
import BrandSection from "@/components/BrandSection";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Specs from "@/components/Specs";
import Story from "@/components/Story";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] text-white overflow-hidden">

      <Navbar />

      <Hero />

      {/* CUSTOMER REVIEWS */}
      <Reviews />

      <FirstRun />

      <BrandSection />

      <Features />

      <Specs />

      <Story />

      <Newsletter />

      <Footer />

    </main>
  );
}