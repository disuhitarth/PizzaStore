import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import HeroSection from '@/components/HeroSection';
import LoyaltyBanner from '@/components/LoyaltyBanner';
import Sidebar from '@/components/Sidebar';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/contexts/CartContext';

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  // Product data for different sections
  const whatsHotProducts = [
    {
      name: "5 FOR",
      price: "$50.00",
      description: "3 BYO 11-inch Pizzas + Your Choice any Two: Entree Salad,\nCheesy Breads, or Dessert.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8559cde1d85afa8752521dd1ea31d0054ba77f05?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/821032f6efc0f2415ca794409387fbb11062cf7b?placeholderIfAbsent=true"
    },
    // Duplicate the deal as requested
    {
      name: "5 FOR",
      price: "$50.00",
      description: "3 BYO 11-inch Pizzas + Your Choice any Two: Entree Salad,\nCheesy Breads, or Dessert.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8559cde1d85afa8752521dd1ea31d0054ba77f05?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/821032f6efc0f2415ca794409387fbb11062cf7b?placeholderIfAbsent=true"
    }
  ];

  const elevenInchPizzas = [
    {
      name: "Build Your Own Pizza (11-inch)",
      price: "$16.99",
      description: "choose any toppings",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ff399916bd8b59354dc821508904757537286f4e?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/14229ea74545f2d8785236354ce746735c63c3ec?placeholderIfAbsent=true"
    },
    {
      name: "Spicy Pepperoni Pizza",
      price: "$15.49",
      description: "NEW Signature Pizza! One of the most popular pizzas by far is\nnow topped with double pepperoni and jalapeño with garlic,",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/a3c6c2cff14551fe42e6145d8df46f33d07fccef?placeholderIfAbsent=true"
    },
    {
      name: "Spicy Pepperoni Pizza",
      price: "$15.49",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    },
    {
      name: "Carnivore (11-inch)",
      price: "$15.49",
      description: "NEW Signature Pizza! Our Chef's signature recipe includes a\nsavory mix of pepperoni slices, julienned ham and crumbled",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/232369e9ab1e1d235cbc9361ceaa7756f0b8c07a?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/84d72d622da5f2c598065d846ed6b42a03a3c2c3?placeholderIfAbsent=true"
    },
    {
      name: "Meatball Pie (11-inch)",
      price: "$15.49",
      description: "NEW Signature Pizza! Our chef-inspired Meatball Pie features\njuicy and flavorful crumbled meatballs accompanied by our",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/838baafe368a1c7f17511dd2cb4f82aaa8e69080?placeholderIfAbsent=true"
    },
    {
      name: "Blazed BBQ (11-inch)",
      price: "$15.49",
      description: "NEW Signature Pizza! The NEW Blaze BBQ Chicken pizza\nrecipe features a base of tangy BBQ sauce, creamy mozzarell",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/3aedd9c032c617ed387912b0dcca5eae616fc5ef?placeholderIfAbsent=true"
    },
    {
      name: "Four Cheese (11-inch)",
      price: "$15.49",
      description: "NEW Signature Pizza! Cheese-lovers unite and rejoice in our\nnew mega cheese pizza. After a base of our house-made red",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/780522e20a912f3bdc9a89de604edcd2a9f7dbaf?placeholderIfAbsent=true"
    },
    {
      name: "Herbivore (11-inch)",
      price: "$15.49",
      description: "NEW Signature Pizza! A new and crazy delicious way to get\nyour daily dose of veggies. Our garden-inspired creation start",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5ccacc878b338aa2baf0d389ae705c2dd3524c97?placeholderIfAbsent=true"
    },
    {
      name: "Vegan Pizza",
      price: "$15.49",
      description: "Our Chef's recipe includes regular dough (v), red sauce, vegan\ncheese, spicy chorizo (v), mushrooms, onions, green bell",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/f2006355d854b7efd70c4d7ec82a7df0dab5a1b8?placeholderIfAbsent=true"
    },
    {
      name: "2 Top Pizza (11-inch)",
      price: "$13.49",
      description: "sauce, cheese & 2 toppings",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/25916b2481ee42fbdaa0ac99b6297fd68af104e4?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/158ae8462c79671037dc64d61a75cd099cc9b198?placeholderIfAbsent=true"
    },
    {
      name: "1 Top Pizza (11-inch)",
      price: "$12.49",
      description: "sauce, cheese & 1 topping",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/0f2b94f0119181751edce900842d1b41e91bc54f?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/21764a8267ab18273cbe7ea7ec925bb6e1a5a27d?placeholderIfAbsent=true"
    },
    {
      name: "Cheese Pizza (Simple Pie) (11-inch)",
      price: "$10.49",
      description: "mozzarella, parmesan, red sauce",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/28aa5fcaa0813d25fbe7b69146a2fc2f5bc2d99d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/1a511cd78708a8ef0cbf1a7da8492276cd3a885f?placeholderIfAbsent=true"
    }
  ];

  const fastFireFavorites = [
    {
      name: "Pepperoni Fast Fire'd Fold",
      price: "$12.99",
      description: "NEW Blaze Fast-Fire'd Folds are based on the concepts of\nItalian calzones and strombolis. The Pepperoni Fast Fire'd Fol",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/57f1382bc601c40d35142e321935109758c76113?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/fa396f549277ca821e816ec4b1d9e2be958f059c?placeholderIfAbsent=true"
    }
  ];

  const takeTwo = [
    {
      name: "Spicy Pepperoni Pizza Half 11-inch Pizza + c…",
      price: "$15.99",
      description: "One of the most popular pizzas by far is now topped with\ndouble pepperoni and jalapeño with garlic, your choice of spic",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/a6bcc4199a0eeeed1a4ec9654575f5e2e97ca72e?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/adf6d55eb5129145865b6d97011c409f396acc2b?placeholderIfAbsent=true"
    },
    {
      name: "Spicy Pepperoni Pizza Half 11-inch Pizza + c…",
      price: "$15.99",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    },
    {
      name: "Build Your Own Half 11-inch Pizza + choice …",
      price: "$15.99",
      description: "choose any toppings + choice of side",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ef52fff421d0472ea9240758b532824610f92dc6?placeholderIfAbsent=true"
    },
    {
      name: "Carnivore Half 11-inch Pizza + choice of side",
      price: "$15.99",
      description: "Our Chef's signature recipe includes a savory mix of pepperoni\nslices, julienned ham and crumbled meatballs. The toppings a",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/0894a61d30e648b107ae5b3f948f5904c1f85a43?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/2e30150efe15c481e9df8df0b43b5d6311473795?placeholderIfAbsent=true"
    },
    {
      name: "Meatball Pie Half 11-inch Pizza + choice of s…",
      price: "$15.99",
      description: "Our chef-inspired Meatball Pie features juicy and flavorful\ncrumbled meatballs accompanied by our classic house-made",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ce6fc1c13b3adc20082b9628b55b012f2ff1d077?placeholderIfAbsent=true"
    },
    {
      name: "Blazed BBQ Half 11-inch Pizza + choice of si…",
      price: "$15.99",
      description: "The NEW Blaze BBQ Chicken pizza recipe features a base of\ntangy BBQ sauce, creamy mozzarella cheese, tender pieces of",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e4e0a9267baff4296f57bcd46b88a7956e1d2fd6?placeholderIfAbsent=true"
    },
    {
      name: "Four Cheese Half 11-inch Pizza + choice of s…",
      price: "$15.99",
      description: "Cheese-lovers unite and rejoice in our new mega cheese pizza.\nAfter a base of our house-made red sauce we then unite four",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/84f7d22358ff465abe71099dc7b8f9bea7433035?placeholderIfAbsent=true"
    },
    {
      name: "Herbivore Half 11-inch Pizza + choice of side",
      price: "$15.99",
      description: "A new and crazy delicious way to get your daily dose of\nveggies. Our garden-inspired creation starts off with our spic",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/9d4ec0d0d0d3f7141a84acb1573450fd67161fdb?placeholderIfAbsent=true"
    },
    {
      name: "Cheesy Bread + choice of side",
      price: "$15.99",
      description: "Our classic dough with shredded mozzarella, oregano, olive oil\ndrizzle, two sides of red sauce + choice of side",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e4a47712885899e911d7017aaa2bd0600195accb?placeholderIfAbsent=true"
    },
    {
      name: "Pesto Garlic Cheesy Bread + choice of side",
      price: "$15.99",
      description: "Our classic dough with shredded mozzarella, oregano, olive oil\ndrizzle, two sides of red sauce + choice of side",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/0f431f347ca41e22dbfac9f41fa95ea9b860f0f4?placeholderIfAbsent=true"
    }
  ];

  const digitalDeals = [
    {
      name: "5 FOR",
      price: "$50.00",
      description: "3 BYO 11-inch Pizzas + Your Choice any Two: Entree Salad,\nCheesy Breads, or Dessert.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8fa2034b12a2554992ec9612a8a4bfc11a0f7e07?placeholderIfAbsent=true"
    },
    {
      name: "Cheesy Bread Bundle",
      price: "$33.95",
      description: "Cheesy Bread, 2-Top Large Pizza, 2 20oz bottled drinks. Online\nOnly.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ff399916bd8b59354dc821508904757537286f4e?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/89edc9dda4566e0b8562dad917b8c52ea57b32ca?placeholderIfAbsent=true"
    },
    {
      name: "Pizza Party for One",
      price: "$14.00",
      description: "Get one 11 inch 1-Top and a 16oz Fountain Drink. (ONLINE\nPICK UP ONLY). 20oz Bottled Beverages may be substituted",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/97e131c0fb59905667eb9f0c8fc1da73a8725a2d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/4cb7f57df340e86934207a7292d3a67a80d747f9?placeholderIfAbsent=true"
    },
    {
      name: "BFF Bundle",
      price: "$42.65",
      description: "2 BYO 11-inch pizzas + 2 fountain drinks + 2 Desserts. Online\nOnly.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/2185ee7527df2d2cba30890fe62f0f5512e0b613?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/d5dbf878eb1a2ceb7ae3251e846d9b7925ec588f?placeholderIfAbsent=true"
    },
    {
      name: "One Large 1-Top Pizza",
      price: "$18.95",
      description: "Get one Large Pizza with your choice of sauce, cheese and 1\ntopping. Online Only.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/d813dcbd0053875e03b6563fe6988dc0d447ac0a?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/bc1527b88735d72d137a977f252a23301b9a62e8?placeholderIfAbsent=true"
    },
    {
      name: "Two Large 2-Top Pizzas",
      price: "$41.40",
      description: "Get two Large Pizzas with your choice of sauce, cheese and 2\ntoppings for each. Online only.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/d3c3cd02cb7cbef6b9994abbc229aabaea2947b0?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/2938bf055d792b463936d54b16bad33854b6f20c?placeholderIfAbsent=true"
    }
  ];

  const cheesyBreadsAndSalads = [
    {
      name: "Green Goddess Chop Salad – Side",
      price: "$6.99",
      description: "This fresh and vibrant salad that's packed with flavor! Crisp\nromaine lettuce is topped with juicy tomatoes, mushrooms,",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/098acd6d89c0fc4880a163379e9cdbd51e54074b?placeholderIfAbsent=true"
    },
    {
      name: "Green Goddess Chop Salad – Entrée",
      price: "$9.99",
      description: "This fresh and vibrant salad that's packed with flavor! Crisp\nromaine lettuce is topped with juicy tomatoes, mushrooms,",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/2185ee7527df2d2cba30890fe62f0f5512e0b613?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/098acd6d89c0fc4880a163379e9cdbd51e54074b?placeholderIfAbsent=true"
    },
    {
      name: "Side Salad",
      price: "$6.99",
      description: "Salad options vary by season and location. Select to make your\nchoice.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/2185ee7527df2d2cba30890fe62f0f5512e0b613?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8618c6bc996bd63b79da740a5da42c7b0faf1706?placeholderIfAbsent=true"
    },
    {
      name: "Entrée Salad",
      price: "$9.99",
      description: "Salad options vary by season and location. Select to make your\nchoice.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/b0ee0434c957145dfd777967b1d54bddd850fbc4?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8618c6bc996bd63b79da740a5da42c7b0faf1706?placeholderIfAbsent=true"
    },
    {
      name: "Pesto Garlic Cheesy Bread",
      price: "$6.99",
      description: "Our classic dough with shredded mozzarella, oregano, chopped\ngarlic, pesto drizzle, two sides of red sauce",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/b0ee0434c957145dfd777967b1d54bddd850fbc4?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/a94b2705fe18bd147f6d14cd3c4c3295f1077747?placeholderIfAbsent=true"
    },
    {
      name: "Cheesy Bread",
      price: "$6.99",
      description: "Our classic dough with shredded mozzarella, oregano, olive oil\ndrizzle, two sides of red sauce",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/b1107503fa7674dcc4f1cfef2cda5970f851c4b9?placeholderIfAbsent=true"
    }
  ];

  const largePizzas = [
    {
      name: "Build Your Own Pizza (Large)",
      price: "$31.95",
      description: "choose your toppings (up to 7)",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ff8a4ed4b8138568da19bb28117853c4531c44a0?placeholderIfAbsent=true"
    },
    {
      name: "Spicy Pepperoni Pizza (Large)",
      price: "$28.00",
      description: "NEW Signature Pizza! One of the most popular pizzas by far is\nnow topped with double pepperoni and jalapeño with garlic,",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/a3c6c2cff14551fe42e6145d8df46f33d07fccef?placeholderIfAbsent=true"
    },
    {
      name: "Spicy Pepperoni Pizza (Large)",
      price: "$28.00",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    },
    {
      name: "Carnivore (Large)",
      price: "$28.00",
      description: "NEW Signature Pizza! Our Chef's signature recipe includes a\nsavory mix of pepperoni slices, julienned ham and crumbled",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/232369e9ab1e1d235cbc9361ceaa7756f0b8c07a?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/4e1f3e7924763439c8977eff4adfcdff770e34c4?placeholderIfAbsent=true"
    },
    {
      name: "Meatball Pie (Large)",
      price: "$28.00",
      description: "NEW Signature Pizza! Our chef-inspired Meatball Pie features\njuicy and flavorful crumbled meatballs accompanied by our",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/7710af470c461a2c778bc1694562572f555c3078?placeholderIfAbsent=true"
    },
    {
      name: "Blazed BBQ (Large)",
      price: "$28.00",
      description: "NEW Signature Pizza! The NEW Blaze BBQ Chicken pizza\nrecipe features a base of tangy BBQ sauce, creamy mozzarell",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/414d49c792155f59c4fd1a56965d6fdbab1275b1?placeholderIfAbsent=true"
    },
    {
      name: "Four Cheese (Large)",
      price: "$28.00",
      description: "NEW Signature Pizza! Cheese-lovers unite and rejoice in our\nnew mega cheese pizza. After a base of our house-made red",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/a084a07b582439938f118fbc04f57559939b1421?placeholderIfAbsent=true"
    },
    {
      name: "Herbivore (Large)",
      price: "$28.00",
      description: "NEW Signature Pizza! A new and crazy delicious way to get\nyour daily dose of veggies. Our garden-inspired creation start",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/b865028f8bcedccf08797f37e84b5f74e6d868a9?placeholderIfAbsent=true"
    },
    {
      name: "Cheese Pizza (Simple Pie) (Large)",
      price: "$17.95",
      description: "mozzarella, parmesan, red sauce",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/7ef1e54ca07baa349fb12db393a531731798f3a8?placeholderIfAbsent=true"
    },
    {
      name: "3 Top Pizza (Large)",
      price: "$24.50",
      description: "sauce, cheese & 3 toppings",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e2b7a7c4bc491aa5a72cb9570ad60073d40f1433?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/729f1b53cd7258d9ba712d0685bfaff104707e1c?placeholderIfAbsent=true"
    },
    {
      name: "2 Top Pizza (Large)",
      price: "$22.50",
      description: "sauce, cheese & 2 toppings",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8e63a2469d47babce03b9d8789da0be94be9c493?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/4307d2e3e104187b44173d7ce12bcc77e6e28b9c?placeholderIfAbsent=true"
    },
    {
      name: "1 Top Pizza (Large)",
      price: "$20.50",
      description: "sauce, cheese & 1 topping",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/05afac60ec27e88a28718caabccccdde989b991a?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/bc1527b88735d72d137a977f252a23301b9a62e8?placeholderIfAbsent=true"
    }
  ];

  const desserts = [
    {
      name: "S'more Pie",
      price: "$3.25",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/d3c3cd02cb7cbef6b9994abbc229aabaea2947b0?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ba631b7298abdb435f77006cc40e7b800b5357bc?placeholderIfAbsent=true"
    },
    {
      name: "Chocolate Brownie",
      price: "$3.25",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/593b26f0584a30019007ead817dfa09605333325?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/39d633d702cdddfd25baa492e5f798c05befabba?placeholderIfAbsent=true"
    },
    {
      name: "Cinnamon Bread",
      price: "$6.99",
      description: "Try our new dessert - Cinnamon Bread. This new sweet treat\ncombines our house made stretched bread with a generous",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/19de00cbb480a173e59b03f6f3e0149d0d4c9102?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/63d401b84cfec1c0313387f51b4d34dc758a7639?placeholderIfAbsent=true"
    }
  ];

  const drinks = [
    {
      name: "Small Drink",
      price: "$2.99",
      description: "16 oz. drinks: House-made lemonades, teas & more. Pickup\nonly.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/2e978182124d1d56649fb56ce0628deaf96a65bf?placeholderIfAbsent=true"
    },
    {
      name: "Regular Drink",
      price: "$3.29",
      description: "24 oz. drinks: House-made lemonades, teas & more. Pickup\nonly.",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/4e0359954e8d01055366f471e998b8bee9f0d007?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/3408831a2635b92f3512366f8c5d0d435fe8d88f?placeholderIfAbsent=true"
    },
    {
      name: "Mexican Coke",
      price: "$3.49",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e1be02f014de5df79775977ad8a534b4e4dbd167?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/4600ec0da1a42c0096e85b956222c40ce7b66c74?placeholderIfAbsent=true"
    },
    {
      name: "San Pellegrino",
      price: "$3.69",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/f02ad6deda7bf1c7ddb672444c933ef13288d813?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/28a4f4926d5b780f502096afae917beb2c1a4697?placeholderIfAbsent=true"
    },
    {
      name: "San Pellegrino Limonata",
      price: "$2.99",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/4053f9c9d22e90073015bada9b11ac15b2c2d3b0?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/7001eb1b12ed9175e288485a68cc29a4bd7ba539?placeholderIfAbsent=true"
    },
    {
      name: "San Pellegrino Blood Orange",
      price: "$2.99",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8e696f39e9856958c3de97b47ca2d032169112c1?placeholderIfAbsent=true"
    },
    {
      name: "Honest Apple Juice",
      price: "$2.19",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/08d7f9be2ad4e2764a1c4666941529dd6a704ff7?placeholderIfAbsent=true"
    },
    {
      name: "Vitamin Water XXX",
      price: "$3.69",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/c7b20cbc2ce0a2f299d39c1a5a0fbb0dcbffc497?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/df9dc5000de59c948459d06f9318c639ced80470?placeholderIfAbsent=true"
    },
    {
      name: "Monster Energy",
      price: "$3.99",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/0bec8894e32e4a72809541f745dab57ede9e0883?placeholderIfAbsent=true"
    },
    {
      name: "Coke Bottle 500mL",
      price: "$3.59",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/24362f93fdef18cdec9273ee8d8b808a19f8f027?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/ae1abe452e4950ab2bfbb0f83e760c9e083bb5f3?placeholderIfAbsent=true"
    },
    {
      name: "Diet Coke Bottle 500mL",
      price: "$3.59",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e46429e5a22f28e4ed309440cd2a62b2ae2634c4?placeholderIfAbsent=true"
    },
    {
      name: "Coke Zero 500mL",
      price: "$3.59",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/8dbf58d16e845a8fa02c7283008d550d758e0447?placeholderIfAbsent=true"
    },
    {
      name: "Sprite Bottle 500mL",
      price: "$3.59",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5fd350d86dffff8b8689c1a3c2edf6734d91cac5?placeholderIfAbsent=true"
    },
    {
      name: "Vitamin Water XOXOX",
      price: "$3.69",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/0f67853c76b5a261fc3b837910450ed5d009419e?placeholderIfAbsent=true"
    },
    {
      name: "Ginger Ale",
      price: "$3.59",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/0bec8894e32e4a72809541f745dab57ede9e0883?placeholderIfAbsent=true"
    },
    {
      name: "Bottled Water",
      price: "$2.69",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/24362f93fdef18cdec9273ee8d8b808a19f8f027?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/e44dbbcc6964f3c9a30e2fd013f6766cf4c0d9f6?placeholderIfAbsent=true"
    },
    {
      name: "Milk",
      price: "$2.99",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/5a9ffd3c1a634373ef2198e356540fd3ebb4313d?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/f207698b899fa9dd51c8751809a44fc771778124?placeholderIfAbsent=true"
    },
    {
      name: "Chocolate Milk",
      price: "$2.99",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      overlayImage: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/987bbcee4beb969b283479e51c3921f593169326?placeholderIfAbsent=true"
    }
  ];

  const singleUseItems = [
    {
      name: "Utensils",
      price: "",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    },
    {
      name: "Napkins",
      price: "",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    },
    {
      name: "Red Pepper Flakes",
      price: "",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    },
    {
      name: "Parmesan",
      price: "",
      description: "Not available at this time",
      image: "https://api.builder.io/api/v1/image/assets/5497bee253214f7fa692ffe091e0dd84/eb1b9f836824469944918317706eb92ecefcac78?placeholderIfAbsent=true",
      isUnavailable: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header />
      
      {/* Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black text-white rounded-full px-6 py-3 hover:bg-black/90 shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-green-500 rounded-full ml-1">
            {totalItems}
          </span>
        )}
      </button>
      
      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
      
      {/* Main Content */}
      <main className="pt-[170px]">
      {/* Banners removed as requested */}
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Loyalty Banner removed */}
        
        {/* Main Layout with Sidebar */}
        <div className="flex w-full pt-16 max-md:flex-col">
          {/* Sidebar Navigation */}
          <aside className="flex-shrink-0">
            <Sidebar />
          </aside>
          
          {/* Main Content Area */}
          <div className="flex-1 px-4 max-md:px-0">
            <div className="max-w-[1354px] w-full">
              <ProductSection title="What's Hot" products={whatsHotProducts} />
              <ProductSection title="11-inch Pizzas" products={elevenInchPizzas} />
              <ProductSection title="Fast Fire'd Favorites" products={fastFireFavorites} layout="single" />
              <ProductSection title="Take Two" products={takeTwo} />
              <ProductSection title="Digital Deals" products={digitalDeals} />
              <ProductSection title="Cheesy Breads & Salads" products={cheesyBreadsAndSalads} />
              <ProductSection title="Large Pizzas" products={largePizzas} />
              <ProductSection title="Desserts" products={desserts} />
              <ProductSection title="Drinks, Beer & Wine" products={drinks} />
              <ProductSection title="Single Use Items" products={singleUseItems} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
