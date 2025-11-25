import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Star, Flame } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

const HeroSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const { locateStores, selectedStore, isLocating, locationError } = useStore();

  const containerVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] },
    },
  } as const;

  const floatingCard = reduceMotion
    ? {}
    : {
        animate: {
          y: [0, -6, 0],
        },
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      } as const;

  return (
    <section className="relative flex flex-col justify-center items-stretch overflow-hidden min-h-[480px] md:min-h-[560px] lg:min-h-[640px] w-full pt-[96px] md:pt-[132px] pb-12 md:pb-20 bg-gradient-to-b from-[#050816] via-[#111827] to-black">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        src="https://cdn.builder.io/o/assets%2F5497bee253214f7fa692ffe091e0dd84%2F6c5c5a542df34a01aef07c1166da96ca?alt=media&token=5908eed9-593c-4e36-9c97-3e4bfaa5dfb3&apiKey=5497bee253214f7fa692ffe091e0dd84"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" aria-hidden="true" />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 text-white items-center text-center lg:flex-row lg:items-center lg:text-left lg:justify-between"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Headline & CTAs */}
        <div className="flex-1 space-y-4 sm:space-y-5 max-w-3xl flex flex-col items-center lg:items-start">
          <motion.h1
            variants={itemVariants}
            className="text-[2.1rem] sm:text-[2.4rem] md:text-[2.9rem] lg:text-[3.1rem] font-black leading-snug sm:leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
          >
            Your pizza, your way.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-[0.9rem] sm:text-[0.95rem] text-white/75"
          >
            Choose your toppings, explore our favourites, create your masterpiece, and let us work our magic.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="mt-3 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-white/75"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/10">
              <Clock className="h-3.5 w-3.5 text-brand" />
              <span>
                Pickup ready in <span className="font-semibold">~20–25 min</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-sm px-3 py-1.5 border border-white/10">
              <Star className="h-3.5 w-3.5 text-yellow-300" />
              <span>
                <span className="font-semibold">4.8</span> avg rating
              </span>
            </div>
          </motion.div>

          {/* Global flavours tagline under stats */}
          <motion.p
            variants={itemVariants}
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] sm:text-[11px] font-medium text-white/85 border border-white/10 shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand/20 text-brand">
              <Flame className="h-2.5 w-2.5" />
            </span>
            <span className="tracking-[0.18em] uppercase">Global flavours, delivered locally</span>
          </motion.p>

          {/* CTAs + location banner */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-col gap-2"
          >
            {/* Desktop / tablet Order Now only; mobile uses bottom CTA */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <a
                href="#monthly-special"
                className="flex w-full max-w-sm sm:w-auto items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-semibold shadow-[0_20px_50px_rgba(185,28,28,0.7)] hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand focus-visible:ring-offset-black transition will-change-transform"
                data-start-order="true"
              >
                Order Now
              </a>
            </div>
            {selectedStore && (
              <div className="inline-flex max-w-xl items-center gap-2 rounded-full bg-[rgba(15,23,42,0.85)] px-3 py-1.5 text-[11px] text-white/85 border border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
                <span className="font-semibold">Nearest store:</span>
                <span className="truncate">
                  {selectedStore.StoreName} \u0000b7 {selectedStore.City}
                  {selectedStore.Distance ? ` \u0000b7 ${selectedStore.Distance} away` : ''}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* No right-side hero card on desktop: keep focus on main message */}
      </motion.div>
    </section>
  );
};

export default HeroSection;
