import CTASection from "../components/landing/CTASection";
import FeaturedProblems from "../components/landing/FeaturedProblems";
import HeroSection from "../components/landing/HeroSection";
import Navbar from "../components/landing/Navbar";
import SiteFooter from "../components/landing/SiteFooter";
import TopicsGrid from "../components/landing/TopicsGrid";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TopicsGrid />
      <FeaturedProblems />
      <CTASection />
      <SiteFooter />
    </div>
  );
};

export default HomePage;
