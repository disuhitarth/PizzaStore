import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FranchisingPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Franchise inquiry submitted', data);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header />

      <main className="pt-[132px]">
        {/* Hero */}
        <section className="bg-[#020617] py-10 sm:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8 md:flex-row md:items-end">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Franchising
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Grow with Pizza Depot.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                Join a fast-growing brand with loyal guests, modern digital ordering, and a support
                team that sets you up to win in your local market.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-200 sm:text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Footprint
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">60+ locations</p>
                  <p className="mt-0.5 text-[11px] text-slate-300">Across ON, MB, AB & SK.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Support
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">Training & marketing</p>
                  <p className="mt-0.5 text-[11px] text-slate-300">Site selection, launch & beyond.</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/40 p-4 text-xs text-slate-100 shadow-xl sm:text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                The Pizza Depot playbook
              </p>
              <ol className="mt-3 space-y-2">
                <li>
                  <span className="font-semibold text-white">1. Apply.</span> Share a bit about your
                  background and preferred market.
                </li>
                <li>
                  <span className="font-semibold text-white">2. Connect.</span> Our team walks you
                  through financials, territory, and fit.
                </li>
                <li>
                  <span className="font-semibold text-white">3. Launch.</span> Get support on site
                  selection, build-out, training, and marketing.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Content + Form */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8 md:flex-row">
            {/* Copy */}
            <div className="w-full md:w-[45%] space-y-6 text-sm text-[#374151]">
              <div>
                <h2 className="text-base font-semibold text-[#111827]">Why Pizza Depot?</h2>
                <p className="mt-2 text-sm text-[#4B5563]">
                  We focus on craveable, customizable pizzas and a streamlined operations model. With
                  strong brand recognition, a simplified menu, and modern digital ordering, you can
                  focus on delivering great guest experiences.
                </p>
              </div>

              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                    Operations
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#111827]">Proven systems</p>
                  <p className="mt-1 text-xs text-[#6B7280]">
                    Training programs, standardized recipes, and vendor relationships to help you
                    operate smoothly.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                    Marketing
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#111827]">Local & digital</p>
                  <p className="mt-1 text-xs text-[#6B7280]">
                    Support with grand-opening campaigns, loyalty, and online ordering.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#111827]">Who we&apos;re looking for</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#4B5563]">
                  <li>Hands-on operators who are passionate about hospitality.</li>
                  <li>Ability to meet investment and liquidity requirements.</li>
                  <li>Local market knowledge and a commitment to community.</li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="w-full md:flex-1">
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-[#111827]">Franchise inquiry</h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Share a few details and the Pizza Depot head office team will follow up with next
                  steps.
                </p>

                {submitted && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                    Thank you for your interest. A member of our team will reach out using the contact
                    details you provided.
                  </div>
                )}

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#374151]" htmlFor="name">
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151]" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#374151]" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        required
                        className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151]" htmlFor="city">
                        City & province
                      </label>
                      <input
                        id="city"
                        name="city"
                        placeholder="e.g. Brampton, ON"
                        required
                        className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#374151]" htmlFor="investment">
                        Approximate investment range
                      </label>
                      <select
                        id="investment"
                        name="investment"
                        className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="">Select</option>
                        <option value="under-300k">Under $300,000</option>
                        <option value="300k-500k">$300,000 – $500,000</option>
                        <option value="500k-plus">$500,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151]" htmlFor="experience">
                        Do you own or operate a business today?
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#374151]" htmlFor="message">
                      Tell us a bit about yourself and your plans
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs text-[#111827] shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-[11px] text-[#6B7280]">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                        className="h-3 w-3 rounded border-[#D1D5DB] text-black focus:ring-black"
                      />
                      <span>
                        I understand this form is for franchise inquiries and consent to be contacted
                        by Pizza Depot.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#C81607] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#C81607] focus:outline-none focus:ring-2 focus:ring-[#C81607] focus:ring-offset-2 focus:ring-offset-white sm:text-sm"
                  >
                    Submit inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FranchisingPage;
