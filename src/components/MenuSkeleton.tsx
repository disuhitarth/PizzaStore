import React from 'react';

const MenuSkeleton: React.FC = () => {
  return (
    <section className="mt-4 space-y-6">
      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-3">
          <div className="h-4 w-40 rounded-full bg-[#E5E7EB] animate-pulse" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="h-40 rounded-2xl border border-[#E5E7EB] bg-[#F3F4F6] animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default MenuSkeleton;