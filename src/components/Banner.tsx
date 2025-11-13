import React from 'react';

interface BannerProps {
  type: 'pickup' | 'promo';
  title?: string;
  subtitle?: string;
  backgroundColor: string;
}

const Banner: React.FC<BannerProps> = ({ type, title, subtitle, backgroundColor }) => {
  return (
    <div 
      className={`relative flex w-full flex-col justify-center items-center pl-6 pr-12 py-4 max-md:px-5`}
      style={{ backgroundColor }}
    >
      <div className="z-0 flex flex-col items-center text-sm text-white font-normal text-center tracking-[0.22px] leading-none">
        {type === 'pickup' && (
          <div className="text-sm font-bold leading-[18px] tracking-[0.219px]">
            <span style={{ color: 'rgba(255,255,255,1)' }}>
              You are ordering{" "}
            </span>
            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,1)' }}>
              Pickup
            </span>
            <span style={{ color: 'rgba(255,255,255,1)' }}> at </span>
            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,1)' }}>
              Toronto, ON - Yonge Sheppard Centre
            </span>
          </div>
        )}
        
        {type === 'promo' && (
          <>
            <div className="text-sm font-normal leading-[18px] tracking-[0.219px] mb-2">
              {title}
            </div>
            <div className="text-sm font-normal leading-[18px] tracking-[0.219px] max-md:max-w-full">
              {subtitle}
            </div>
          </>
        )}
      </div>
      
      <button className="absolute z-0 w-[34px] pr-4 pt-2 right-0 top-0" aria-label="Close banner">
        <img
          src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/d14b980e94dca74288ca9138f4be0f95c6b4a3e7?placeholderIfAbsent=true"
          alt="Close"
          className="aspect-[1] object-contain w-full"
        />
      </button>
    </div>
  );
};

export default Banner;
