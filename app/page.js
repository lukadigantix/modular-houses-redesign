import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Products from "@/components/Products";
import Features from "@/components/Features";
import HorizontalDetails from "@/components/HorizontalDetails";
import Testimonials from "@/components/Testimonials";
import ReserveNow from "@/components/ReserveNow";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-clip">
      <Hero />
      <Intro />
      <Products />
      <Features />
      <HorizontalDetails />
      <Testimonials />
      <ReserveNow />
      <Footer />
    </main>
  );
}
