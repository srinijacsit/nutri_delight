import { Product } from "@/lib/types";

// Business Rules Metadata:
// 1. Healthy Tiffins parcel fee: +₹10
// 2. Chicken Roll + Omelette: +₹10
// 3. Chicken Roll + Cheese: +₹20

export const menu: Product[] = [
  // TEA / COFFEE
  { id: "tea", name: "Tea", price: 15, category: "Tea / Coffee" },
  { id: "coffee", name: "Coffee", price: 25, category: "Tea / Coffee" },
  { id: "green-tea", name: "Green Tea", price: 25, category: "Tea / Coffee" },
  { id: "horlicks-boost", name: "Horlicks/Boost", price: 25, category: "Tea / Coffee" },

  // PANI PURI
  { id: "pani-puri-6", name: "Pani Puri (6)", price: 30, category: "Pani Puri" },
  { id: "pani-puri-parcel-10", name: "Pani Puri (Parcel - 10)", price: 60, category: "Pani Puri" },
  { id: "pani-puri-parcel-20", name: "Pani Puri (Parcel - 20)", price: 100, category: "Pani Puri" },

  // HEALTHY TIFFINS
  // PARCEL — ₹10 EXTRA
  { id: "plain-dosa", name: "Plain Dosa", price: 30, category: "Healthy Tiffins" },
  { id: "onion-dosa", name: "Onion Dosa", price: 40, category: "Healthy Tiffins" },
  { id: "raagi-dosa", name: "Raagi Dosa", price: 50, category: "Healthy Tiffins" },
  { id: "multi-millet-dosa", name: "Multi Millet Dosa", price: 50, category: "Healthy Tiffins" },
  { id: "pesarrattu", name: "Pesarrattu", price: 50, category: "Healthy Tiffins" },
  { id: "egg-dosa", name: "Egg Dosa", price: 50, category: "Healthy Tiffins" },
  { id: "double-egg-dosa", name: "Double Egg Dosa", price: 60, category: "Healthy Tiffins" },

  // FLAVORED MILK
  { id: "badam-milk", name: "Badam Milk", price: 50, category: "Flavored Milk" },
  { id: "rosemilk", name: "Rosemilk", price: 50, category: "Flavored Milk" },
  { id: "pista-milk", name: "Pista Milk", price: 60, category: "Flavored Milk" },

  // FRESH FRUIT JUICES
  { id: "watermelon", name: "Watermelon", price: 40, category: "Fresh Fruit Juices" },
  { id: "grape", name: "Grape", price: 60, category: "Fresh Fruit Juices" },
  { id: "pineapple", name: "PineApple", price: 80, category: "Fresh Fruit Juices" },
  { id: "kharbuja", name: "Kharbuja", price: 50, category: "Fresh Fruit Juices" },
  { id: "seethaphal", name: "SeethaPhal", price: 100, category: "Fresh Fruit Juices" },

  // EVENING SNACKS
  // Chicken Roll modifiers: With Omelette — ₹10 EXTRA, With Cheese — ₹20 EXTRA
  { id: "veg-sandwich", name: "Veg Sandwich", price: 60, category: "Evening Snacks" },
  { id: "chicken-sandwich", name: "Chicken Sandwich", price: 100, category: "Evening Snacks" },
  { id: "paneer-sandwich", name: "Paneer Sandwich", price: 90, category: "Evening Snacks" },
  { id: "egg-roll", name: "Egg Roll", price: 50, category: "Evening Snacks" },
  { id: "paneer-roll", name: "Paneer Roll", price: 90, category: "Evening Snacks" },
  { id: "chicken-roll", name: "Chicken Roll", price: 100, category: "Evening Snacks" },
  { id: "bread-omelette", name: "Bread Omelette", price: 60, category: "Evening Snacks" },
  { id: "double-egg-omelette", name: "Double Egg Omelette", price: 50, category: "Evening Snacks" },

  // 3PM SNACKS
  { id: "minapa-punukulu", name: "Minapa Punukulu", price: 30, category: "3PM Snacks" },
  { id: "mirchi-bajji-3", name: "Mirchi Bajji (3)", price: 30, category: "3PM Snacks" },
  { id: "bobbarlu-vada-3", name: "Bobbarlu Vada (3)", price: 30, category: "3PM Snacks" },
];
