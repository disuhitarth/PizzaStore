import React from 'react';
import { toast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const secretClickCount = React.useRef(0);
  const resetTimeoutId = React.useRef<number | null>(null);

  const handlePoweredByClick = () => {
    if (typeof window === 'undefined') return;

    secretClickCount.current += 1;

    if (resetTimeoutId.current !== null) {
      window.clearTimeout(resetTimeoutId.current);
    }

    resetTimeoutId.current = window.setTimeout(() => {
      secretClickCount.current = 0;
      resetTimeoutId.current = null;
    }, 900);

    if (secretClickCount.current >= 5) {
      secretClickCount.current = 0;

      if (typeof document !== 'undefined') {
        document.body.classList.add('bolo-dev-mode');
        window.setTimeout(() => {
          document.body.classList.remove('bolo-dev-mode');
        }, 6000);
      }

      toast({
        title: 'Kitchen debug mode',
        description: 'Debug grid overlay enabled. You found the hidden BOLO signature.',
      });
    }
  };

  return (
    <footer className="mt-24 bg-brand-soft text-[#374151] max-md:mt-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="space-y-3 md:w-1/3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fa41905418d4741659ddbf033a32ed4a1"
            alt="Pizza Depot Logo"
            className="h-8 w-auto object-contain"
          />
          <p className="text-xs text-[#4B5563]">
            Fresh, flame-baked pizzas made your way. Order online for pickup or delivery from locations
            across Ontario, Manitoba, Alberta and Saskatchewan.
          </p>
        </div>

        {/* Navigation */}
        <div className="grid flex-1 grid-cols-2 gap-6 text-xs sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
              Explore
            </p>
            <ul className="space-y-1">
              <li>
                <a href="/" className="hover:text-white">
                  Menu
                </a>
              </li>
              <li>
                <a href="/locations" className="hover:text-white">
                  Locations
                </a>
              </li>
              <li>
                <a href="/franchising" className="hover:text-white">
                  Franchising
                </a>
              </li>
              <li>
                <a href="/nutritional-info" className="hover:text-white">
                  Nutritional info
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
              Help
            </p>
            <ul className="space-y-1">
              <li>
                <a href="/order-status" className="hover:text-white">
                  Order status
                </a>
              </li>
              <li>
                <a href="/locations" className="hover:text-white">
                  Contact a store
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms &amp; privacy
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
              Head office
            </p>
            <ul className="space-y-1 text-xs">
              <li>2 Automatic Rd, Unit 122</li>
              <li>Brampton, ON L6S 6K8</li>
              <li>
                <a href="tel:+18665979711" className="hover:text-white">
                  +1-866-597-9711
                </a>
              </li>
              <li>
                <a href="mailto:customerservice@pizzadepot.ca" className="hover:text-white">
                  customerservice@pizzadepot.ca
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-soft-border bg-brand-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[11px] text-[#6B7280] sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} Pizza Depot. All rights reserved.
          </span>
          <span>
            Powered by{' '}
            <button
              type="button"
              onClick={handlePoweredByClick}
              className="font-semibold text-[#374151] hover:text-brand focus:outline-none"
            >
              BOLO
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
