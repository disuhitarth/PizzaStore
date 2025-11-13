import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-stretch overflow-hidden relative min-h-[300px] w-full py-[126px] max-md:py-[100px]">
      <img
        src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/a72dae42e646b433d68fcb6b1a676014b1dec65d?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="relative flex min-h-12 w-full max-md:max-w-full" />
    </section>
  );
};

export default HeroSection;
