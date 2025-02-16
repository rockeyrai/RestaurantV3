import Footer from "@/component/Footer";
import HeroSection from "@/component/HeroSection";
import Navbar from "@/component/Navbar";
import PopularItems from "@/component/Popularltems";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <PopularItems />
      <Footer />
    </div>
  );
}
