import React from 'react';
import ProductCard from './ProductCard';
import { motion, useReducedMotion } from 'framer-motion';

interface SizeOption {
  label: string;
  price: number;
}

interface Product {
  name: string;
  price: string;
  description?: string;
  image: string;
  overlayImage?: string;
  isUnavailable?: boolean;
  sizeOptions?: SizeOption[];
  /** Optional visual badges like "Best seller", "Vegan", etc. */
  badges?: string[];
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  layout?: 'single' | 'grid';
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  layout = 'grid',
}) => {
  const id = slugify(title);
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  } as const;

  const hasProducts = products && products.length > 0;

  if (!hasProducts) {
    return null;
  }

  return (
    <section id={id} className="scroll-mt-28 w-full pb-16">
      <div className="mx-auto max-w-screen-2xl w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="w-full text-[#36424e]">
          <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-[0.5px]">
            {title}
          </h2>
        </header>

        <div className="w-full mt-2">
          {layout === 'single' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="flex w-full"
            >
              <motion.div variants={itemVariants} className="w-full max-w-md">
                <ProductCard {...products[0]} />
              </motion.div>
            </motion.div>
          ) : (
            // Responsive grid: 1 col on phones, 2 on tablets, 3 on laptops/MacBooks
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8"
            >
              {products.map((product, index) => (
                <motion.div key={index} variants={itemVariants} className="flex justify-center">
                  <ProductCard {...product} className="w-full" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
