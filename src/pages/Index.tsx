import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/contexts/CartContext';
import { menuCategories } from '@/menuData';

const DEFAULT_IMAGE =
  'https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fff8a4ed4b8138568da19bb28117853c4531c44a0';

const formatPrice = (value?: number) =>
  typeof value === 'number' ? `$${value.toFixed(2)}` : '';

const Index: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const sections = menuCategories.map((category) => ({
    title: category.categoryName,
    products: category.items.map((item) => ({
      name: item.itemName,
      description: item.description,
      price: formatPrice(item.price ?? item.startingPrice ?? item.sizes?.[0]?.price),
      image: DEFAULT_IMAGE,
      sizeOptions: item.sizes?.map((size) => ({
        label: size.sizeDescription,
        price: size.price,
      })),
    })),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header with cart icon */}
      <Header onCartClick={() => setCartOpen(true)} totalItems={totalItems}>
      </Header>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />

      {/* Main Content */}
      <main className="pt-[120px]">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Layout with Sidebar */}
        <div className="flex w-full pt-16 max-md:flex-col">
          {/* Sidebar Navigation */}
          <aside className="flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 px-4 max-md:px-0">
            <div className="max-w-[1354px] w-full">
              {sections.map((section) => (
                <ProductSection
                  key={section.title}
                  title={section.title}
                  products={section.products}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
