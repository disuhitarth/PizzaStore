import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { useKonamiPizzaRain } from "@/hooks/use-konami-pizza-rain";
import PizzaRain from "@/components/PizzaRain";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LocationsPage from "./pages/Locations";
import FranchisingPage from "./pages/Franchising";
import NutritionalInfoPage from "./pages/NutritionalInfo";
import OrderStatusPage from "./pages/OrderStatus";
import PineapplePage from "./pages/Pineapple";
import MobileNav from "@/components/MobileNav";

import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const isRaining = useKonamiPizzaRain();
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-center" />
      {isRaining && <PizzaRain />}
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
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
        <MobileNav />
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export default App;
