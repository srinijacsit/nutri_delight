export const categoryImages: Record<string, string> = {
  "Tea / Coffee": "/images/tea_coffee.jpg",
  "Pani Puri": "/images/pani_puri.jpg",
  "Healthy Tiffins": "/images/dosa.jpg",
  "Flavored Milk": "/images/flavored_milk.jpg",
  "Fresh Fruit Juices": "/images/fresh_juice.jpg",
  "Evening Snacks": "/images/sandwich.jpg",
  "3PM Snacks": "/images/indian_snacks.jpg",
};

export const productImages: Record<string, string> = {
  "tea": "/images/tea_coffee.jpg",
  "coffee": "/images/tea_coffee.jpg",
  "green-tea": "/images/tea_coffee.jpg",
  "horlicks-boost": "/images/tea_coffee.jpg",
  
  "pani-puri-6": "/images/pani_puri.jpg",
  "pani-puri-parcel-10": "/images/pani_puri.jpg",
  "pani-puri-parcel-20": "/images/pani_puri.jpg",
  
  "plain-dosa": "/images/dosa.jpg",
  "onion-dosa": "/images/dosa.jpg",
  "raagi-dosa": "/images/dosa.jpg",
  "multi-millet-dosa": "/images/dosa.jpg",
  "pesarrattu": "/images/dosa.jpg",
  "egg-dosa": "/images/dosa.jpg",
  "double-egg-dosa": "/images/dosa.jpg",
  
  "badam-milk": "/images/flavored_milk.jpg",
  "rosemilk": "/images/flavored_milk.jpg",
  "pista-milk": "/images/flavored_milk.jpg",
  
  "watermelon": "/images/fresh_juice.jpg",
  "grape": "/images/fresh_juice.jpg",
  "pineapple": "/images/fresh_juice.jpg",
  "kharbuja": "/images/fresh_juice.jpg",
  "seethaphal": "/images/fresh_juice.jpg",
  
  "veg-sandwich": "/images/sandwich.jpg",
  "chicken-sandwich": "/images/sandwich.jpg",
  "paneer-sandwich": "/images/sandwich.jpg",
  
  "egg-roll": "/images/roll.jpg",
  "paneer-roll": "/images/roll.jpg",
  "chicken-roll": "/images/roll.jpg",
  
  "bread-omelette": "/images/omelette.jpg",
  "double-egg-omelette": "/images/omelette.jpg",
  
  "minapa-punukulu": "/images/indian_snacks.jpg",
  "mirchi-bajji-3": "/images/indian_snacks.jpg",
  "bobbarlu-vada-3": "/images/indian_snacks.jpg",
};

export function getProductImage(productId: string): string {
  return productImages[productId] || "/brand/nutridelight-logo.jpeg";
}

export function getCategoryImage(categoryName: string): string {
  return categoryImages[categoryName] || "/brand/nutridelight-logo.jpeg";
}
