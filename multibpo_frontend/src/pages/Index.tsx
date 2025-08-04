import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import SecondHero from "@/components/SecondHero";
import CTABanners from "@/components/CTABanners";
import Services from "@/components/Services";
import LightFooter from "@/components/Footer";
import Courses from "@/components/Courses";
import Blog from "@/components/Blog";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import "@/components/ui/showcase-product.css";
import WhatsAppAssistant from "@/components/WhatsAppAssistant";
import CTASection from "@/components/CTASection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  useSmoothScroll();
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Header enableScrollAnimation={true} />
      <NewHero />
      <SecondHero />
      <CTABanners />
      <ConsultoriaIA />
      <WhatsAppAssistant />
      <CTASection />
      <Services />
      <Blog />
      <Courses />
      <LightFooter />
    </div>
  );
};

export default Index;
