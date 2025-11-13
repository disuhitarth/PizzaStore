import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    'Privacy Policy',
    'Terms & Conditions',
    'Online-Tracking Opt Out Guide',
    'About Thanx'
  ];

  return (
    <footer className="flex w-full items-center justify-between gap-[40px_100px] flex-wrap bg-[#E9EAEC] mt-24 px-16 py-6 max-md:mt-10 max-md:px-5">
      {/* Logo */}
      <img
        src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/927f1e44d922c4336946e3870eba93cd377cf5b9?placeholderIfAbsent=true"
        alt="Blaze Pizza Logo"
        className="aspect-[5/2] object-contain w-[150px] max-w-[1920px]"
      />
      
      {/* Footer Links and Social */}
      <nav className="flex items-center flex-wrap px-6 max-md:px-5">
        {footerLinks.map((link) => (
          <div key={link} className="flex flex-col text-sm text-[#6a747f] font-normal text-center tracking-[0.22px] leading-none pl-6 pt-0.5 pb-[3px]">
            <div className="flex flex-col items-center pt-0.5">
              <button className="text-sm font-normal leading-[18px] tracking-[0.219px]">
                {link}
              </button>
            </div>
          </div>
        ))}
        
        {/* Social Media Button */}
        <div className="flex w-[68px] pl-6">
          <div className="flex w-full max-w-11 flex-col items-center">
            <button className="bg-[rgba(195,84,19,1)] flex w-full items-center justify-center h-11 px-1.5 rounded-[22px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e4c92945cc5c8a518a88e468b53c5985a95669e9?placeholderIfAbsent=true"
                alt="Social media"
                className="aspect-[1] object-contain w-8"
              />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Powered by Thanx */}
      <div className="max-w-[1920px] aspect-[175/32] overflow-hidden w-[175px]">
        <div className="flex min-h-8 max-w-full w-[175px] flex-col overflow-hidden items-center justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e065eadae2e64c86c75671d58c82bd73ee7f1504?placeholderIfAbsent=true"
            alt="Powered by Thanx"
            className="aspect-[5.46] object-contain w-full"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
