export interface MenuItemSize {
  sizeDescription: string;
  price: number;
}

export interface MenuItem {
  itemId: string;
  itemName: string;
  description?: string;
  price?: number;
  startingPrice?: number;
  sizes?: MenuItemSize[];
}

export interface MenuCategory {
  categoryId: string;
  categoryName: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    categoryId: "monthly-special",
    categoryName: "Monthly Special",
    items: [
      {
        itemId: "C538",
        itemName: "Late Night Special",
        description: "1 Medium Pizza with 3 toppings & 2 Dips",
        startingPrice: 14.99,
        sizes: [
          { sizeDescription: "Medium", price: 14.99 },
          { sizeDescription: "Large", price: 16.99 },
        ],
      },
      {
        itemId: "C290",
        itemName: "Seasons Eating",
        description:
          "1 Large Pizza with 3 Toppings, 1 Cake Slice, 1 Dipping & 1 591ml Pop",
        price: 24.99,
      },
      {
        itemId: "C559",
        itemName: "Jingle Bell Bundle",
        description:
          "1 Large Pizza 3 toppings, Loaded Fries, 1 Pop Bottle & 1 Dipping Sauce",
        price: 29.99,
      },
      {
        itemId: "C620",
        itemName: "Merry Pair Special",
        description:
          "2 Pizzas with 3 toppings on each & 2 Dips, Add 2 Cheesecake or Loaded Fries for $9.99",
        price: 31.99,
      },
      {
        itemId: "C644",
        itemName: "Pizza Depot Classic",
        description:
          "2 Large Pizzas with 3 Toppings on each, Garlic Bread with Cheese, 2 Dips & 591ml pop",
        price: 42.99,
      },
      {
        itemId: "C642",
        itemName: "Santa's Square Deal",
        description:
          "1 topping square party pizza, 1 dip, 20 classic chicken wings",
        price: 49.99,
      },
      {
        itemId: "C410",
        itemName: "Family Feast Special",
        description:
          "2 Pizzas with 6 Top Combined, 10 Chicken Wings, Potato Wedges or Garlic Bread, 2 Pop Bottles + 3 Dip",
        price: 55.99,
      },
      {
        itemId: "C643",
        itemName: "Bundle of Fun",
        description:
          "2 X-Large Pizzas 3 toppings on each, 20 Classic Wings, 2 Loaded Fries, 2x 2L Pop, 5 Dips",
        price: 99.99,
      },
    ],
  },
  {
    categoryId: "specials",
    categoryName: "Specials",
    items: [
      {
        itemId: "C493",
        itemName: "Special #1",
        description: "1 Pizza with 1 Topping & 1 Dipping Sauce",
        startingPrice: 9.99,
        sizes: [
          { sizeDescription: "Small", price: 9.99 },
          { sizeDescription: "Medium", price: 11.99 },
          { sizeDescription: "Large", price: 13.99 },
        ],
      },
      {
        itemId: "C500",
        itemName: "Special #2",
        description: "1 Pizza with 3 Toppings & 1 Dipping Sauce",
        startingPrice: 12.99,
        sizes: [
          { sizeDescription: "Small", price: 12.99 },
          { sizeDescription: "Medium", price: 15.99 },
          { sizeDescription: "Large", price: 17.99 },
          { sizeDescription: "X-Large", price: 19.99 },
        ],
      },
      {
        itemId: "C123",
        itemName: "Special #3",
        description: "2 Pizzas with 6 combined toppings & 2 dips",
        startingPrice: 22.99,
        sizes: [
          { sizeDescription: "Small", price: 22.99 },
          { sizeDescription: "Medium", price: 27.99 },
          { sizeDescription: "Large", price: 31.99 },
          { sizeDescription: "X-Large", price: 35.99 },
        ],
      },
      {
        itemId: "C146",
        itemName: "Special #4",
        description: "3 Pizzas with 9 combined toppings & 3 Dipping Sauces",
        startingPrice: 33.99,
        sizes: [
          { sizeDescription: "Small", price: 33.99 },
          { sizeDescription: "Medium", price: 39.99 },
          { sizeDescription: "Large", price: 46.99 },
          { sizeDescription: "Extra Large", price: 52.99 },
        ],
      },
      {
        itemId: "C634",
        itemName: "Special #5",
        description:
          "1 Pizza with 2 toppings and an option of 5 or 10 Wings with 1 Dipping Sauce",
        startingPrice: 18.99,
        sizes: [
          { sizeDescription: "Small - 5 Wings", price: 18.99 },
          { sizeDescription: "Medium - 10 Wings", price: 25.99 },
          { sizeDescription: "Large - 10 Wings", price: 28.99 },
          { sizeDescription: "X-Large - 10 Wings", price: 31.99 },
        ],
      },
      {
        itemId: "C609",
        itemName: "Special #6",
        description: "1 Square Pizza with 1 topping & 1 Dipping Sauce",
        price: 25.99,
      },
      {
        itemId: "C541",
        itemName: "Special #7",
        description:
          "Loaded French Fries with Butter Chicken or Tandoori Veggie Paneer",
        price: 11.99,
      },
    ],
  },
  {
    categoryId: "build-your-own",
    categoryName: "Build Your Own",
    items: [
      {
        itemId: "C578",
        itemName: "Make Your Own (Small)",
        description: "Single Small Pizza with Pizza Sauce & Mozzarella Cheese",
        price: 8.99,
      },
      {
        itemId: "C395",
        itemName: "Make Your Own (Medium)",
        description: "Single Medium Pizza with Pizza Sauce & Mozzarella Cheese",
        price: 10.99,
      },
      {
        itemId: "C396",
        itemName: "Make Your Own (Large)",
        description: "Single Large Pizza with Pizza Sauce & Mozzarella Cheese",
        price: 12.99,
      },
      {
        itemId: "C397",
        itemName: "Make Your Own (X-Large)",
        description: "Single X-Large Pizza with Pizza Sauce & Mozzarella Cheese",
        price: 14.99,
      },
      {
        itemId: "C398",
        itemName: "Make Your Own (Square)",
        description:
          "Single Square Pizza with Pizza Sauce & Mozzarella Cheese and one topping (Toppings Extra)",
        price: 24.99,
      },
    ],
  },
  {
    categoryId: "traditional-pizzas",
    categoryName: "Traditional Pizzas",
    items: [
      {
        itemId: "C388",
        itemName: "Canadian Pizza",
        description: "Pepperoni, Mushrooms & Bacon",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C352",
        itemName: "Meat Lovers Pizza",
        description: "Ground Beef, Pepperoni, Bacon & Sausage",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C336",
        itemName: "Meatball Pizza",
        description: "Juicy Meatballs, Green Peppers & Onions",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C376",
        itemName: "Greek Pizza",
        description:
          "Black Olives, Sliced Tomatoes, Onions & Feta Cheese",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C384",
        itemName: "Hawaiian Pizza",
        description: "Ham, Pineapple & Extra Cheese",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C356",
        itemName: "Buffalo Chicken Pizza",
        description: "Buffalo Chicken, Onions & Hot Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C324",
        itemName: "Health Smart Pizza",
        description: "Green peppers, Onions, Mushrooms & Broccoli",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C368",
        itemName: "Canadian Veggie Pizza",
        description: "Green Peppers, Tomatoes, Mushrooms & Green Olives",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C372",
        itemName: "Mexican Pizza",
        description: "Ground Beef, Tomatoes, Onions & Jalapeno Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C360",
        itemName: "Chicken Deluxe Pizza",
        description: "Chicken, Mushrooms, Green Peppers & Onions",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C380",
        itemName: "Spicy Italian Pizza",
        description:
          "Thin Crust, Hot Italian Sausage, Ham & Roasted Red Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C328",
        itemName: "Garden Veggie Pizza",
        description: "Green Peppers, Onions, Tomatoes & Green Olives",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C344",
        itemName: "Bacon Cheeseburger Pizza",
        description:
          "Bacon, Ground Beef, Cheddar & Mozzarella Cheese",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C364",
        itemName: "BBQ Chicken Pizza",
        description: "BBQ Chicken, Mushrooms & Red Onions",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C320",
        itemName: "Spicy Veggie Deluxe",
        description:
          "Single Pizza with Green peppers, Onions, Tomatoes & Hot Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C479",
        itemName: "Signature Veggie Corn",
        description:
          "1 Pizza with Garlic Sauce Base, Corn, Green Pepper, Mushrooms & Red Onion",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C485",
        itemName: "Signature Chicken Corn",
        description: "1 Pizza with Chicken, Corn, Hot Pepper",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
    ],
  },
  {
    categoryId: "gourmet-pizzas",
    categoryName: "Gourmet Pizzas",
    items: [
      {
        itemId: "C631",
        itemName: "Chilli Mango Pizza - Veg",
        description:
          "Chilli Mango Sauce, Hot Banana Peppers, Jalapeno Peppers, Red Onion, Mango",
        startingPrice: 15.99,
        sizes: [
          { sizeDescription: "Medium", price: 15.99 },
          { sizeDescription: "Large", price: 17.99 },
          { sizeDescription: "X Large", price: 19.99 },
        ],
      },
      {
        itemId: "C613",
        itemName: "Chilli Mango Pizza - Chicken",
        description:
          "Chicken, Chilli Mango Sauce, Hot Banana Peppers, Red Onion, Mango",
        startingPrice: 15.99,
        sizes: [
          { sizeDescription: "Medium", price: 15.99 },
          { sizeDescription: "Large", price: 17.99 },
          { sizeDescription: "X Large", price: 19.99 },
        ],
      },
      {
        itemId: "C615",
        itemName: "Shahi Paneer Pizza",
        description:
          "Shahi Paneer Green Peppers, Onions & Roasted Red Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C583",
        itemName: "Achaari Chaap Pizza",
        description: "Achari Chaap, Green Peppers, Onion, Hot Peppers",
        startingPrice: 14.99,
        sizes: [
          { sizeDescription: "Small", price: 14.99 },
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C587",
        itemName: "Tandoori Chaap Pizza",
        description: "Tandoori Chaap, Green Peppers, Onion, Hot Peppers",
        startingPrice: 14.99,
        sizes: [
          { sizeDescription: "Small", price: 14.99 },
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C542",
        itemName: "Chicken Kebab",
        description:
          "Roasted Red Pepper, Green Pepper, Red Onion, Chicken Kebab",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C543",
        itemName: "Chicken Peri Peri",
        description:
          "Peri Peri chicken, green peppers, onions & roasted red peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C544",
        itemName: "Lamb Kebab",
        description:
          "Roasted Red Pepper, Green Pepper, Red Onion, Lamb Kebab",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C545",
        itemName: "Paneer Peri Peri",
        description:
          "Peri Peri paneer, green peppers, onions & roasted red peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C482",
        itemName: "Shawarma Chicken Pizza",
        description:
          "1 Pizza with Shawarma Chicken, Tomatoes & Onions",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C332",
        itemName: "Paneer Pizza",
        description:
          "Paneer, Green peppers, Onions & Roasted Red Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C340",
        itemName: "Tandoori Chicken Pizza",
        description:
          "Tandoori Chicken, Green Peppers, Onions & Roasted Red Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
      {
        itemId: "C348",
        itemName: "Butter Chicken Pizza",
        description:
          "Butter Chicken, Green Peppers, Onions & Roasted Red Peppers",
        startingPrice: 16.99,
        sizes: [
          { sizeDescription: "Medium", price: 16.99 },
          { sizeDescription: "Large", price: 19.99 },
          { sizeDescription: "X-Large", price: 22.99 },
        ],
      },
    ],
  },
  {
    categoryId: "chicken",
    categoryName: "Chicken",
    items: [
      {
        itemId: "C623",
        itemName: "Classic Wings",
        startingPrice: 13.99,
        sizes: [
          { sizeDescription: "10 Pcs", price: 13.99 },
          { sizeDescription: "20 Pcs", price: 26.99 },
          { sizeDescription: "30 Pcs", price: 37.99 },
          { sizeDescription: "40 Pcs", price: 48.99 },
        ],
      },
      {
        itemId: "C597",
        itemName: "Breaded Wings",
        description: "Delicious breaded wings",
        startingPrice: 15.99,
        sizes: [
          { sizeDescription: "10 Wings - 1 Flavour", price: 15.99 },
          { sizeDescription: "20 Wings - 2 Flavours", price: 28.99 },
          { sizeDescription: "30 Wings - 2 Flavours", price: 43.99 },
          { sizeDescription: "40 Wings - 2 Flavours", price: 56.99 },
        ],
      },
      {
        itemId: "C301",
        itemName: "Wings Combo",
        description: "10 wings, small fries, and 1 bottle of pop",
        price: 18.99,
      },
      {
        itemId: "I322",
        itemName: "Boneless Wings (10 pcs)",
        description:
          "Crispy battered boneless wings of chicken breast available with your choice of dip",
        price: 12.99,
      },
      {
        itemId: "I323",
        itemName: "Chicken Strips (6 pcs)",
        description:
          "Boneless strips of chicken breast meat available with your choice of dip",
        price: 11.99,
      },
      {
        itemId: "I457",
        itemName: "Indian Style Wings",
        description:
          "Seasoned with hot sauce, caesar, onions, ginger, green chili & coriander",
        startingPrice: 15.99,
        sizes: [
          { sizeDescription: "10 Pcs", price: 15.99 },
          { sizeDescription: "20 Pcs", price: 28.99 },
          { sizeDescription: "30 Pcs", price: 39.99 },
          { sizeDescription: "40 Pcs", price: 50.99 },
        ],
      },
    ],
  },
  {
    categoryId: "perfect-sides",
    categoryName: "Perfect Sides",
    items: [
      {
        itemId: "I354",
        itemName: "Fish",
        startingPrice: 6.99,
        sizes: [
          { sizeDescription: "1 PC", price: 6.99 },
          { sizeDescription: "2 Pcs", price: 11.99 },
        ],
      },
      {
        itemId: "I201",
        itemName: "Fries",
        startingPrice: 3.99,
        sizes: [
          { sizeDescription: "Small", price: 3.99 },
          { sizeDescription: "Large", price: 5.99 },
        ],
      },
      {
        itemId: "I602",
        itemName: "Seasoned Fries",
        description: "Drizzled with Garlic Sauce",
        price: 7.99,
      },
      {
        itemId: "I600",
        itemName: "Loaded Fries",
        description:
          "Loaded French Fries with Chicken or Tandoori Veggie Paneer",
        price: 11.99,
      },
      {
        itemId: "I589",
        itemName: "Poutine",
        startingPrice: 6.75,
        sizes: [
          { sizeDescription: "Small", price: 6.75 },
          { sizeDescription: "Large", price: 9.4 },
        ],
      },
      {
        itemId: "I206",
        itemName: "Potato Wedges - Large",
        description: "Seasoned and savoury wedges",
        price: 6.99,
      },
      {
        itemId: "I603",
        itemName: "Seasoned Potato Wedges",
        description: "Drizzled with Garlic Sauce",
        price: 8.99,
      },
      {
        itemId: "I242",
        itemName: "Onion Rings - 10 Pcs",
        description: "Large, delicious golden rings",
        price: 5.99,
      },
      {
        itemId: "I316",
        itemName: "Mozzarella Sticks (6 Pcs)",
        description: "Breaded sticks of mozzarella",
        price: 6.99,
      },
      {
        itemId: "I318",
        itemName: "Oven Baked Samosa",
        description: "A tasty South Asian treat",
        price: 1.26,
      },
      {
        itemId: "I586",
        itemName: "Soya Chaap",
        startingPrice: 12.99,
        sizes: [
          { sizeDescription: "Tandoori Chaap", price: 12.99 },
          { sizeDescription: "Achari Chaap", price: 12.99 },
          { sizeDescription: "Malai Chaap", price: 12.99 },
        ],
      },
      {
        itemId: "C247",
        itemName: "Fish & Chips Combo",
        description:
          "1 piece of perfectly fried fish, small fries, and pop bottle",
        price: 11.99,
      },
    ],
  },
  {
    categoryId: "breads",
    categoryName: "Breads",
    items: [
      {
        itemId: "I78",
        itemName: "Garlic Bread",
        description: "Toasted garlic baguette",
        price: 4.99,
      },
      {
        itemId: "I349",
        itemName: "Garlic Bread with Cheese",
        description:
          "Toasted garlic baguette with a topping of cheese",
        price: 6.99,
      },
      {
        itemId: "I153",
        itemName: "Garlic Sticks 6 Pcs",
        description:
          "Scrumptuous fingers of garlic bread topped with cheese",
        price: 6.99,
      },
      {
        itemId: "I371",
        itemName: "Cheesy Bread",
        description:
          "Strips of freshly made bread topped with a tasty cheese mix",
        price: 6.99,
      },
      {
        itemId: "I372",
        itemName: "Cinnamon Bread",
        description:
          "Strips of cinnamon flavoured bread with icing, perfect for sharing",
        price: 7.99,
      },
    ],
  },
  {
    categoryId: "sandwiches",
    categoryName: "Sandwiches",
    items: [
      {
        itemId: "C296",
        itemName: "10\" Panzerotti",
        description:
          "A 10\" Panzerotti made to your liking with a choice of 3 toppings",
        price: 9.99,
      },
      {
        itemId: "C246",
        itemName: "Burger Combo",
        description:
          "1 Veggie or Chicken Burger, Small Fries and 1x591ml Pop Bottle",
        price: 12.99,
      },
      {
        itemId: "C248",
        itemName: "Pizza Sub",
        description:
          "Toasted garlic baguette topped with cheese and your choice of 3 toppings",
        price: 9.49,
      },
    ],
  },
  {
    categoryId: "salads",
    categoryName: "Salads",
    items: [
      {
        itemId: "I150",
        itemName: "Caesar Salad",
        description:
          "Romaine lettuce, parmesan cheese and croutons topped with Caesar dressing, Add Bacon Strip",
        price: 7.99,
      },
      {
        itemId: "I249",
        itemName: "Chicken Caesar Salad",
        description:
          "Lettuce, parmesan cheese, croutons, caesar dressing and chicken breast strips",
        price: 8.99,
      },
      {
        itemId: "I613",
        itemName: "Mango Caesar Salad",
        description:
          "lettuce, parmesan cheese, croutons, mango & caesar dressing",
        price: 8.99,
      },
      {
        itemId: "I151",
        itemName: "Greek Salad",
        description:
          "Lettuce, tomatoes, red onions, feta cheese, and olives topped with Greek dressing",
        price: 7.99,
      },
    ],
  },
  {
    categoryId: "dips",
    categoryName: "Dips",
    items: [
      {
        itemId: "I195",
        itemName: "Creamy Garlic",
        price: 1.49,
      },
      {
        itemId: "I162",
        itemName: "Cheddar Chipotle",
        price: 1.49,
      },
      {
        itemId: "I161",
        itemName: "Ranch Dip",
        price: 1.49,
      },
      {
        itemId: "I160",
        itemName: "Marinara Dip",
        price: 1.49,
      },
    ],
  },
  {
    categoryId: "591ml-bottles",
    categoryName: "591 ml Bottles",
    items: [
      { itemId: "I169", itemName: "591 ML BTL Pepsi", price: 2.99 },
      { itemId: "I170", itemName: "591 ML BTL Diet Pepsi", price: 2.99 },
      { itemId: "I171", itemName: "591 ML BTL 7 UP", price: 2.99 },
      { itemId: "I389", itemName: "591 ML BTL Ginger Ale", price: 2.99 },
      { itemId: "I405", itemName: "591 ML BTL Mountain Dew", price: 2.99 },
      { itemId: "I399", itemName: "591 ML BTL Orange Crush", price: 2.99 },
      { itemId: "I446", itemName: "591 ML CREAM SODA", price: 2.99 },
      { itemId: "I447", itemName: "591 ML GRAPE SODA", price: 2.99 },
      { itemId: "I400", itemName: "591 ML BTL Brisk Ice Tea", price: 2.99 },
      { itemId: "I402", itemName: "591 ML BTL Brisk Lemonade", price: 2.99 },
      { itemId: "I442", itemName: "591 ML Dr Pepper", price: 2.99 },
      { itemId: "I172", itemName: "591 ML BTL Root Beer", price: 2.99 },
      { itemId: "I173", itemName: "Water Bottle", price: 1.99 },
    ],
  },
  {
    categoryId: "2l-pop",
    categoryName: "2L Pop",
    items: [
      { itemId: "I62", itemName: "2L Pepsi", price: 4.99 },
      { itemId: "I157", itemName: "2L Diet Pepsi", price: 4.99 },
      { itemId: "I175", itemName: "2L 7 UP", price: 4.99 },
      { itemId: "I393", itemName: "2L Orange Crush", price: 4.99 },
      { itemId: "I438", itemName: "2L Brisk Ice Tea", price: 4.99 },
    ],
  },
  {
    categoryId: "desserts",
    categoryName: "Desserts",
    items: [
      { itemId: "I427", itemName: "Lava Cake", price: 3.99 },
      { itemId: "I435", itemName: "Strawberry Cheesecake Slice", price: 5.99 },
    ],
  },
];
