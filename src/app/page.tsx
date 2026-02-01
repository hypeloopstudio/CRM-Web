import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Results } from "@/components/results"
import { Factory } from "@/components/factory"
import { Services } from "@/components/services"
import { Team } from "@/components/team"
import { Boutique } from "@/components/boutique"
import { BookingSection } from "@/components/booking-section"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Results />
      <Factory />
      <Services />
      <Team />
      <Boutique />
      <BookingSection />
      <Contact />
      <Footer />
    </main>
  )
}
