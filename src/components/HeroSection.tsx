import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Star, Flame } from 'lucide-react';

const HeroSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

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
          y: [0, -10, 0],
        },
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      } as const;

  return (
    <section className="relative flex flex-col justify-center items-stretch overflow-hidden min-h-[520px] md:min-h-[620px] lg:min-h-[700px] w-full py-16 md:py-24 bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        src="https://cdn.builder.io/o/assets%2F5497bee253214f7fa692ffe091e0dd84%2F6c5c5a542df34a01aef07c1166da96ca?alt=media&token=5908eed9-593c-4e36-9c97-3e4bfaa5dfb3&apiKey=5497bee253214f7fa692ffe091e0dd84"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10" aria-hidden="true" />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8 text-white md:flex-row md:items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Left: headline & CTAs */}
        <div className="flex-1 space-y-4">
          <motion.p
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <Flame className="h-3 w-3" />
            </span>
            Fresh. Fast. Flame-baked.
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-tight drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
          >
            Pizza, built your way.
            <span className="block text-[#FFB347]">Craft your perfect pie in just a few taps.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-sm sm:text-base text-white/80"
          >
            Build your own from dozens of toppings or choose a chef-crafted favourite. See pricing
            update live, discover smart combos, and fly through checkout without friction.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/80"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 border border-white/10">
              <Clock className="h-3.5 w-3.5 text-[#FFB347]" />
              <span>
                Pickup ready in <span className="font-semibold">~20–25 min</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 border border-white/10">
              <Star className="h-3.5 w-3.5 text-yellow-300" />
              <span>
                <span className="font-semibold">4.8</span> avg rating
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 border border-white/10">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>Earn Flames with every order</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            <a
              href="#monthly-special"
              className="inline-flex items-center rounded-full bg-[#FF6A00] px-5 py-2.5 text-sm font-semibold shadow-[0_18px_45px_rgba(248,113,22,0.6)] hover:bg-[#E85C00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-black transition will-change-transform"
              data-start-order="true"
            >
              Start your order
            </a>
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-white/40 bg-black/40 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black transition"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const el = document.querySelector('#specials') as HTMLElement | null;
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
            >
              View deals
            </button>
          </motion.div>

          {/* Tiny reassurance line */}
          <motion.p
            variants={itemVariants}
            className="mt-2 text-[11px] text-white/70"
          >
            No login required. Customize everything, see your total live, and checkout when you&apos;re ready.
          </motion.p>
        </div>

        {/* Right: floating promo card (desktop only) */}
        <motion.div
          className="hidden md:block flex-1 pl-4"
          {...floatingCard}
        >
          <div className="relative mx-auto max-w-sm">
            <div className="pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[#FF6A00]/70 via-[#FFB347]/40 to-transparent opacity-70 blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/60 px-5 py-4 shadow-[0_22px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-sm font-semibold">
                    PD
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/80">Chef&apos;s pick</span>
                    <span className="text-sm font-semibold text-white">Late Night Special</span>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-[#FFB347] inline-flex items-center gap-1">
                  <Flame className="h-3 w-3" /> Hot
                </span>
              </div>

              <div className="relative mb-3 h-32 w-full overflow-hidden rounded-2xl bg-black/40">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fff8a4ed4b8138568da19bb28117853c4531c44a0"
                  alt="Butter Chicken Pizza"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-white/90">
                  <span className="rounded-full bg-black/60 px-2 py-1">3 toppings + 2 dips</span>
                  <span className="rounded-full bg-black/60 px-2 py-1">Medium · Large</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-white/60">From</span>
                  <span className="text-xl font-semibold text-white">$14.99</span>
                  <span className="mt-1 text-[11px] text-white/70">1 medium pizza, 3 toppings &amp; 2 dips.</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-white text-xs font-semibold text-black px-4 py-2 shadow-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black transition"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const el = document.querySelector('#monthly-special') as HTMLElement | null;
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                >
                  View this special
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
