import React, { useState } from 'react';
import { menuCategories } from '@/menuData';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState(menuCategories[0]?.categoryName ?? '');

  const menuItems = menuCategories.map((category) => category.categoryName);

  return (
    <nav
      className="hidden md:flex md:sticky md:top-[100px] z-40 bg-[#F8F9FA] text-sm text-[#6a747f] font-normal capitalize tracking-[0.22px] leading-none
                 flex-col gap-1
                 min-w-60 w-[292px] pl-12 pr-4 py-3"
    >
      {menuItems.map((item) => {
        const isActive = activeItem === item;
        const slug = slugify(item);
        return (
          <div key={item} className="pb-2 max-md:pb-0 max-md:pr-3">
            <a
              href={`#${slug}`}
              className={
                `block max-md:inline-block max-md:rounded-full max-md:border max-md:border-[#D6DADE] max-md:px-3 max-md:py-2 max-md:bg-white max-md:text-[#36424e]
                 text-left pl-[23px] pt-1 pb-[3px] max-md:pl-3 max-md:pt-2 max-md:pb-2 ` +
                (isActive
                  ? 'text-[#c35413] font-bold border-l-[3px] border-l-[#C35413] max-md:border-l-0 max-md:border-[#C35413] max-md:bg-[#FFF7F2]'
                  : '')
              }
              onClick={() => setActiveItem(item)}
            >
              <span className="text-sm leading-[18px] tracking-[0.219px]">
                {item}
              </span>
            </a>
          </div>
        );
      })}
    </nav>
  );
};

export default Sidebar;
