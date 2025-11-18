import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-stretch overflow-hidden relative min-h-[380px] w-full pb-[80px] max-md:py-[80px]">
      <video
        className="absolute h-full w-full object-cover inset-0"
        src="https://cdn.builder.io/o/assets%2F5497bee253214f7fa692ffe091e0dd84%2F6c5c5a542df34a01aef07c1166da96ca?alt=media&token=5908eed9-593c-4e36-9c97-3e4bfaa5dfb3&apiKey=5497bee253214f7fa692ffe091e0dd84"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="relative flex min-h-12 w-full max-md:max-w-full" />
    </section>
  );
};

export default HeroSection;
