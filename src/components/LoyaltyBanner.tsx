import React from 'react';
import { siteMedia } from '@/siteMedia';

const LoyaltyBanner: React.FC = () => {
  return (
    <div className="flex w-full flex-wrap items-center justify-center bg-white px-16 py-4 max-md:px-5">
      <div className="flex w-14 pr-4">
        <img
          src={siteMedia.banners.loyaltyIconUrl}
          alt="Flames icon"
          className="aspect-[1] object-contain w-10 max-w-10"
        />
      </div>
      <div className="flex items-center text-sm tracking-[0.22px] leading-none">
        <span className="text-[#6a747f] text-sm font-normal leading-[18px] tracking-[0.219px]">
          Join our rewards program for bonus points
        </span>
        <button className="rounded flex items-center text-brand font-bold text-center justify-center px-1.5 py-1 ml-2">
          <span className="text-sm font-bold leading-[18px] tracking-[0.219px]">
            Sign Up
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoyaltyBanner;
