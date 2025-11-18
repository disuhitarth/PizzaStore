import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F2F4F5]">
      <div className="relative flex items-center justify-center min-h-[100px] px-[49px] py-5 max-md:px-5">
        {/* Logo */}
        <div className="flex-shrink-0 flex justify-center">
          <img
            className="h-8 w-auto object-contain"
            src="https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fa41905418d4741659ddbf033a32ed4a1"
            alt="Pizza Depot Logo"
          />
        </div>

        {/* Cart (signup/login removed) */}
        <div className="absolute right-[49px] max-md:right-5 flex items-center justify-end">
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
