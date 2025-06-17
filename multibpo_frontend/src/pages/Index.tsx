import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import RevealSection from "@/components/RevealSection";
import CTABanners from "@/components/CTABanners";
import Services from "@/components/Services";
import WhatsAppAssistant from "@/components/WhatsAppAssistant";
import HowItWorks from "@/components/HowItWorks";
import LightFooter from "@/components/LightFooter";
import Courses from "@/components/Courses";
import QuemSomos from "@/components/QuemSomos";
import Blog from "@/components/Blog";
import BentoSection from "@/components/BentoSection";
import ExampleUseCases from "@/components/ExampleUseCases";
import "@/components/ui/showcase-product.css";

const Index = () => {
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Header enableScrollAnimation={true} />
      <NewHero />
      <RevealSection />
      <CTABanners />
      <ExampleUseCases />
      <BentoSection />
      <Services />
      <QuemSomos />
      <Blog />
      <Courses />
      <LightFooter />
    </div>
  );
};

export default Index;
