import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const HeadOfficeSection: React.FC = () => {
  return (
    <section className="mt-16 border-t border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-start">
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            Head Office
          </h2>
          <p className="mt-2 text-xl font-semibold text-[#111827]">
            Pizza Depot Head Office
          </p>
          <p className="mt-2 max-w-xl text-sm text-[#4B5563]">
            Questions about your order, franchising, or corporate partnerships? Reach out to our
            head office team and we&apos;ll be happy to help.
          </p>

          <div className="mt-4 space-y-3 text-sm text-[#111827]">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF2FF] text-[#1D4ED8]">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-medium">2 Automatic Rd, Unit 122</p>
                <p>Brampton, ON L6S 6K8</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-medium">Toll-free</p>
                <a
                  href="tel:+18665979711"
                  className="text-[#111827] hover:underline"
                >
                  +1-866-597-9711
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <div className="space-y-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Customer Service</p>
                  <a
                    href="mailto:customerservice@pizzadepot.ca"
                    className="text-[#111827] hover:underline"
                  >
                    customerservice@pizzadepot.ca
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Head Office</p>
                  <a
                    href="mailto:headoffice@pizzadepot.ca"
                    className="text-[#111827] hover:underline"
                  >
                    headoffice@pizzadepot.ca
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
              Service area
            </p>
            <p className="mt-1 text-sm text-[#111827]">
              Proudly serving communities across Ontario, Manitoba, Alberta and Saskatchewan.
            </p>
            <div className="mt-4 h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1D4ED8]">
              <div className="flex h-full w-full flex-col justify-between p-4 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/70">Flagship</p>
                  <p className="text-sm font-semibold">Brampton, ON</p>
                  <p className="mt-1 text-[11px] text-white/80">
                    Use your location to find the nearest Pizza Depot and start your order in a couple of taps.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/80">
                  <span>Tap "Use my location" in the header to see nearby stores.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadOfficeSection;
