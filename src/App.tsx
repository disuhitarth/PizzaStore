import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { useKonamiFlameMode } from "@/hooks/use-konami-flame-mode";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LocationsPage from "./pages/Locations";
import FranchisingPage from "./pages/Franchising";
import NutritionalInfoPage from "./pages/NutritionalInfo";
import OrderStatusPage from "./pages/OrderStatus";
import PineapplePage from "./pages/Pineapple";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Global keyboard easter egg: classic Konami code enables a brief "flame mode" glow.
  useKonamiFlameMode();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="bottom-center" />
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/franchising" element={<FranchisingPage />} />
                <Route path="/nutritional-info" element={<NutritionalInfoPage />} />
                <Route path="/order-status" element={<OrderStatusPage />} />
                <Route path="/pineapple" element={<PineapplePage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export default App;
