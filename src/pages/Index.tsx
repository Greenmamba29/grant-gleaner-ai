import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import OperationalExcellence from "@/components/OperationalExcellence";
import DashboardPreview from "@/components/DashboardPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CapabilitiesSection />
        <OperationalExcellence />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
