import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Claude from "./pages/Claude";

// 📱 PÁGINAS MOBILE - MULTIBPO WHATSAPP INTEGRATION
import CadastroMobile from "./pages/mobile/CadastroMobile";
import VerificarEmail from "./pages/mobile/VerificarEmail";
import EmailValidado from "./pages/mobile/EmailValidado";
import LoginMobile from "./pages/mobile/LoginMobile";
import PoliticaMobile from "./pages/mobile/PoliticaMobile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/claude" element={<Claude />} />
          
          {/* 📱 ROTAS MOBILE - MULTIBPO WHATSAPP INTEGRATION */}
          <Route path="/m/cadastro" element={<CadastroMobile />} />
          <Route path="/m/verificar-email" element={<VerificarEmail />} />
          <Route path="/m/verificar-email/:token" element={<EmailValidado />} />
          <Route path="/m/sucesso" element={<EmailValidado />} />
          <Route path="/m/login" element={<LoginMobile />} />
          <Route path="/m/politica" element={<PoliticaMobile />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;