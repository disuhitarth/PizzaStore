import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="flex w-full items-center justify-between bg-[#E9EAEC] mt-24 px-16 py-6 max-md:mt-10 max-md:px-5">
      {/* Logo */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fa41905418d4741659ddbf033a32ed4a1"
        alt="Pizza Depot Logo"
        className="aspect-[5/2] object-contain w-[150px] max-w-[1920px]"
      />

      {/* Powered by BOLO */}
      <div className="text-sm text-[#6a747f] font-normal tracking-[0.22px]">
        Powered by <span className="font-semibold">BOLO</span>
      </div>
    </footer>
  );
};

export default Footer;
