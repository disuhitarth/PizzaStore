import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F2F4F5]">
      <div className="flex items-center justify-between min-h-[100px] px-[49px] py-5 max-md:px-5">
        {/* Location and Pickup Info */}
        <div className="flex-1 min-w-60 max-md:max-w-full">
          <div className="w-full max-w-[313px]">
            <div className="w-full text-[#36424e] font-bold pb-2">
              <button 
                className="flex items-center gap-1 w-full"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
              >
                <span className="text-sm font-bold leading-[18px] tracking-[0.219px]">
                  Pickup ASAP
                </span>
                <img
                  src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/cbbd036316416cdbafe083ac0763d28290f631ea?placeholderIfAbsent=true"
                  alt="Dropdown arrow"
                  className="aspect-[0.86] object-contain w-3"
                />
              </button>
            </div>
            <div className="flex items-stretch">
              <div className="flex-1 text-[#6a747f] font-normal pr-2">
                <span className="text-sm font-normal leading-[18px] tracking-[0.219px]">
                  at Toronto, ON - Yonge Sheppard Centre
                </span>
              </div>
              <button className="text-[#c35413] font-bold whitespace-nowrap">
                <span className="text-sm font-bold leading-[18px] tracking-[0.219px]">
                  Change
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/927f1e44d922c4336946e3870eba93cd377cf5b9?placeholderIfAbsent=true"
            alt="Blaze Pizza Logo"
            className="aspect-[5/2] object-contain w-[150px] h-auto"
          />
        </div>

        {/* Cart (signup/login removed) */}
        <div className="flex-1 flex items-center justify-end min-w-60 max-md:max-w-full">
          <button className="w-[27px] h-6" aria-label="View cart">
            <img
              src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/f0bca5ca31e4a7fe41bd08f549b5681affe6ce31?placeholderIfAbsent=true"
              alt="Shopping cart"
              className="aspect-[1.12] object-contain w-full"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
