import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/Statsbar";
import HowItWorks from "@/components/Howitsworks";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* <StatsBar /> */}
      <HowItWorks />
      <Categories />
      <Footer />
    </main>
  );
}