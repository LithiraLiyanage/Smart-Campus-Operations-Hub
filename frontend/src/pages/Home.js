import Navbar from "../components/layout/Navbar";
import Hero from "../components/ui/Hero";
import Features from "../components/ui/Features";
import Resources from "../components/ui/Resources";
import HowItWorks from "../components/ui/HowItWorks";
import CTA from "../components/ui/CTA";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Resources />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
