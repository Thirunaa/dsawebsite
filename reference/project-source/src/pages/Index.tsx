import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TopicsGrid from "@/components/TopicsGrid";
import FeaturedProblems from "@/components/FeaturedProblems";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <TopicsGrid />
    <FeaturedProblems />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
