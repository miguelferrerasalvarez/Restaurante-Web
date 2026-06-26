import { Hero } from "@/components/public/Hero";
import { BookingSection } from "@/components/public/BookingSection";
import { Menu } from "@/components/public/Menu";
import { About } from "@/components/public/About";
import { Reviews } from "@/components/public/Reviews";
import { Location } from "@/components/public/Location";
import { Footer } from "@/components/public/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BookingSection />
      <Menu />
      <About />
      <Reviews />
      <Location />
      <Footer />
    </main>
  );
}
