import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PineapplePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9C3] via-[#FFEDD5] to-[#FECACA] text-slate-900">
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            Secret oven
          </span>
          <Link
            to="/"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to menu
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-10 text-center sm:py-16">
        <motion.div
          initial={{ scale: 0.8, rotate: -4, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          className="relative inline-flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 shadow-xl shadow-amber-400/50"
        >
          <motion.span
            className="text-6xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            🍍
          </motion.span>
          <span className="pointer-events-none absolute -top-2 -right-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
            debate
          </span>
        </motion.div>

        <div className="space-y-3 max-w-xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Pineapple on pizza?
          </h1>
          <p className="text-sm text-slate-700 sm:text-base">
            You just unlocked the most controversial topping in the oven. Whether you are Team Pineapple or
            firmly opposed, we respect your flavour journey.
          </p>
          <p className="text-xs text-slate-500">
            Fun fact: this page was baked as an easter egg. Only elite pizza explorers ever find it.
          </p>
        </div>

        <motion.div
          className="grid w-full max-w-xl gap-3 text-left sm:grid-cols-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          <motion.div
            className="rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm"
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              Team pineapple
            </p>
            <p className="mt-1 text-sm text-slate-800">
              Sweet, tangy, and slightly rebellious. Pair with jalape1os for maximum chaos.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-rose-200 bg-white/80 p-4 shadow-sm"
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
              Team classic
            </p>
            <p className="mt-1 text-sm text-slate-800">
              Keep it traditional with pepperoni and extra cheese. No fruit in the oven, ever.
            </p>
          </motion.div>
        </motion.div>

        <p className="mt-4 text-[11px] text-slate-500">
          P.S. Try the logo and footer in the main app if you have not already. The oven hides more secrets.
        </p>
      </main>
    </div>
  );
};

export default PineapplePage;
