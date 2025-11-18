export const pizzaConfig = {
  "pizza": {
    "name": "Make Your Own",
    "description": "Single Large Pizza with Pizza Sauce & Mozzarella Cheese",
    "size": "Large",
    "quantity": {
      "min": 1,
      "max": 10,
      "default": 1
    },
    "customization": {
      "crust": {
        "type": "single_choice",
        "required": true,
        "default": "255",
        "options": [
          {
            "id": "255",
            "name": "Regular Crust",
            "price": 0
          },
          {
            "id": "281",
            "name": "Whole Wheat",
            "price": 0
          },
          {
            "id": "8",
            "name": "Thin Crust",
            "price": 0
          },
          {
            "id": "162",
            "name": "Extra Thin",
            "price": 0
          },
          {
            "id": "38",
            "name": "Thick Crust",
            "price": 0
          },
          {
            "id": "220",
            "name": "Pan Pizza",
            "price": 2.99
          }
        ]
      },
      "sauce": {
        "type": "single_choice",
        "required": true,
        "default": "256",
        "options": [
          {
            "id": "256",
            "name": "Regular Sauce",
            "price": 0
          },
          {
            "id": "37",
            "name": "Easy Sauce",
            "price": 0
          },
          {
            "id": "31",
            "name": "No Sauce",
            "price": 0
          },
          {
            "id": "6",
            "name": "Extra Sauce",
            "price": 0
          },
          {
            "id": "39",
            "name": "BBQ Sauce Instead Of Tomato",
            "price": 0
          },
          {
            "id": "40",
            "name": "BBQ Sauce Mixed",
            "price": 0
          },
          {
            "id": "288",
            "name": "Creamy Garlic Base",
            "price": 1.99
          },
          {
            "id": "289",
            "name": "Butter Chicken Sauce Base",
            "price": 1.99
          },
          {
            "id": "371",
            "name": "Chilli Mango Sauce",
            "price": 1.99
          }
        ]
      },
      "pizzaOptions": {
        "type": "multiple_choice",
        "required": false,
        "options": [
          {
            "id": "1",
            "name": "Well Done"
          },
          {
            "id": "54",
            "name": "Easy Cheese"
          },
          {
            "id": "32",
            "name": "Light Done"
          }
        ]
      },
      "toppings": {
        "placementOptions": {
          "N": "None",
          "L": "Left Half",
          "W": "Whole/Full",
          "R": "Right Half",
          "D": "Double (2X)"
        },
        "categories": {
          "meat": {
            "displayName": "Meat Toppings",
            "items": [
              { "id": "609", "name": "Achari Chicken", "special": true },
              { "id": "44", "name": "Pepperoni" },
              { "id": "41", "name": "Ham" },
              { "id": "35", "name": "Bacon Bits" },
              { "id": "198", "name": "Bacon Strips" },
              { "id": "98", "name": "Ground Beef" },
              { "id": "32", "name": "Salami" },
              { "id": "42", "name": "Mild Sausage" },
              { "id": "29", "name": "Hot Italian Sausage" },
              { "id": "368", "name": "Meatball" },
              { "id": "227", "name": "Chicken", "special": true },
              { "id": "370", "name": "BBQ Chicken", "special": true },
              { "id": "369", "name": "Buffalo Chicken", "special": true },
              { "id": "328", "name": "Butter Chicken", "special": true },
              { "id": "548", "name": "Chicken Kebab", "special": true },
              { "id": "549", "name": "Lamb Kebab", "special": true },
              { "id": "556", "name": "Peri Peri Chicken", "special": true },
              { "id": "489", "name": "Shawarma Chicken", "special": true },
              { "id": "37", "name": "Tandoori Chicken", "special": true }
            ]
          },
          "halal": {
            "displayName": "Halal Toppings",
            "items": [
              { "id": "411", "name": "Halal Pepperoni" },
              { "id": "412", "name": "Halal Beef" },
              { "id": "596", "name": "Halal Lamb Kebab", "special": true },
              { "id": "597", "name": "Halal BBQ Chicken", "special": true },
              { "id": "598", "name": "Halal Buffalo Chicken", "special": true },
              { "id": "592", "name": "Halal Butter Chicken", "special": true },
              { "id": "413", "name": "Halal Chicken", "special": true },
              { "id": "595", "name": "Halal Chicken Kebab", "special": true },
              { "id": "593", "name": "Halal Peri Peri Chicken", "special": true },
              { "id": "599", "name": "Halal Shawarma Chicken", "special": true },
              { "id": "594", "name": "Halal Tandoori Chicken", "special": true }
            ]
          },
          "veggie": {
            "displayName": "Vegetable Toppings",
            "items": [
              { "id": "610", "name": "Achari Paneer" },
              { "id": "607", "name": "Mango", "new": true },
              { "id": "584", "name": "Achaari Chaap" },
              { "id": "555", "name": "Peri Peri Paneer" },
              { "id": "585", "name": "Tandoori Chaap" },
              { "id": "43", "name": "Mushroom" },
              { "id": "33", "name": "Tomatoes" },
              { "id": "40", "name": "Green Pepper" },
              { "id": "36", "name": "Broccoli" },
              { "id": "22", "name": "Black Olives" },
              { "id": "26", "name": "Green Olives" },
              { "id": "45", "name": "Red Onion" },
              { "id": "422", "name": "Spinach" },
              { "id": "28", "name": "Hot Banana Peppers" },
              { "id": "492", "name": "Corn" },
              { "id": "31", "name": "Pineapple" },
              { "id": "493", "name": "Plant Based Pepperoni", "special": true },
              { "id": "364", "name": "Jalapeno Peppers" },
              { "id": "47", "name": "Sundried Tomatoes" },
              { "id": "34", "name": "Roasted Red Pepper" },
              { "id": "329", "name": "Tandoori Paneer" },
              { "id": "148", "name": "Shahi Paneer" }
            ]
          },
          "free": {
            "displayName": "Free Toppings",
            "items": [
              { "id": "101", "name": "Coriander", "free": true, "noDouble": true },
              { "id": "99", "name": "Fresh Garlic", "free": true, "noDouble": true },
              { "id": "100", "name": "Green Chillies", "free": true, "noDouble": true },
              { "id": "230", "name": "Ginger", "free": true, "noDouble": true },
              { "id": "229", "name": "Dry Chilli Pepper", "free": true, "noDouble": true }
            ]
          },
          "cheese": {
            "displayName": "Cheese Options",
            "items": [
              { "id": "25", "name": "Feta" },
              { "id": "426", "name": "No Cheese", "free": true },
              { "id": "23", "name": "Cheddar Cheese" },
              { "id": "38", "name": "Extra Cheese" }
            ]
          }
        }
      }
    },
    "specialtyPizzas": [
      { "id": "69", "name": "Bacon Cheeseburger", "description": "Cheddar Cheese, Bacon Bits, Ground Beef", "toppings": ["98", "35", "23"] },
      { "id": "75", "name": "BBQ Chicken", "description": "Mushroom, Red Onion, BBQ Chicken", "toppings": ["45", "43", "370"] },
      { "id": "74", "name": "Buffalo Chicken", "description": "Hot Banana Peppers, Red Onion, Buffalo Chicken", "toppings": ["45", "28", "369"] },
      { "id": "73", "name": "Butter Chicken", "description": "Roasted Red Pepper, Green Pepper, Red Onion, Butter Chicken", "toppings": ["328", "45", "40", "34"] },
      { "id": "63", "name": "Canadian", "description": "Bacon Bits, Mushroom, Pepperoni", "toppings": ["44", "35", "43"] },
      { "id": "71", "name": "Chicken Deluxe", "description": "Green Pepper, Mushroom, Red Onion, Chicken", "toppings": ["227", "45", "43", "40"] },
      { "id": "79", "name": "Chicken Kebab", "description": "Roasted Red Pepper, Green Pepper, Red Onion, Chicken Kebab", "toppings": ["548", "40", "45", "34"] },
      { "id": "58", "name": "Garden Veggie", "description": "Green Olives, Tomatoes, Green Pepper, Red Onion", "toppings": ["40", "33", "26", "45"] },
      { "id": "59", "name": "Greek", "description": "Black Olives, Feta, Tomatoes, Red Onion", "toppings": ["45", "33", "25", "22"] },
      { "id": "60", "name": "Hawaiian", "description": "Pineapple, Extra Cheese, Ham", "toppings": ["41", "38", "31"] },
      { "id": "65", "name": "Health Smart", "description": "Broccoli, Green Pepper, Mushroom, Red Onion", "toppings": ["36", "45", "43", "40"] },
      { "id": "80", "name": "Lamb Kebab", "description": "Roasted Red Pepper, Green Pepper, Red Onion, Lamb Kebab", "toppings": ["40", "549", "45", "34"] },
      { "id": "70", "name": "Meat Lovers", "description": "Green Olives, Bacon Bits, Mild Sausage, Pepperoni, Ground Beef", "toppings": ["98", "44", "42", "35", "26"] },
      { "id": "68", "name": "MeatBall", "description": "Green Pepper, Red Onion, Meatball", "toppings": ["45", "40", "368"] },
      { "id": "76", "name": "Mediterranean", "description": "Sundried Tomatoes, Zucchini, Eggplant", "toppings": ["424", "47", "455"] },
      { "id": "61", "name": "Mexican", "description": "Tomatoes, Red Onion, Ground Beef, Jalapeno Peppers", "toppings": ["98", "364", "45", "33"] },
      { "id": "77", "name": "Shawarma Pizza", "description": "Onion, Tomatoes, Shawarma Chicken", "toppings": ["45", "489", "33"] },
      { "id": "62", "name": "Spicy Italian", "description": "Hot Italian Sausage, Roasted Red Pepper, Ham", "toppings": ["41", "29", "34"] },
      { "id": "64", "name": "Spicy Veggie Deluxe", "description": "Hot Banana Peppers, Tomatoes, Green Pepper, Red Onion", "toppings": ["45", "40", "33", "28"] },
      { "id": "78", "name": "Spicy Veggie Paneer", "description": "Hot Banana Peppers, Green Pepper, Red Onion, Tandoori Paneer", "toppings": ["45", "40", "329", "28"] },
      { "id": "72", "name": "Tandoori Chicken", "description": "Roasted Red Pepper, Tandoori Chicken, Green Pepper, Red Onion", "toppings": ["37", "45", "40", "34"] },
      { "id": "67", "name": "Veggie", "description": "Green Olives, Tomatoes, Green Pepper, Mushroom", "toppings": ["43", "40", "33", "26"] },
      { "id": "66", "name": "Veggie Paneer", "description": "Roasted Red Pepper, Green Pepper, Red Onion, Tandoori Paneer", "toppings": ["45", "40", "329", "34"] }
    ]
  }
} as const;
