import React from 'react';

const LoyaltyBanner: React.FC = () => {
  return (
    <div className="flex w-full flex-wrap items-center justify-center bg-white px-16 py-4 max-md:px-5">
      <div className="flex w-14 pr-4">
        <img
          src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/51ccd1e009e612fbe5606c1cdef43283bdee40df?placeholderIfAbsent=true"
          alt="Flames icon"
          className="aspect-[1] object-contain w-10 max-w-10"
        />
      </div>
      <div className="flex items-center text-sm tracking-[0.22px] leading-none">
        <span className="text-[#6a747f] text-sm font-normal leading-[18px] tracking-[0.219px]">
          Join our rewards program for bonus points
        </span>
        <button className="rounded flex items-center text-[#C81607] font-bold text-center justify-center px-1.5 py-1 ml-2">
          <span className="text-sm font-bold leading-[18px] tracking-[0.219px]">
            Sign Up
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoyaltyBanner;
