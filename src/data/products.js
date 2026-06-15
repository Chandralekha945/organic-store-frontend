import forestHoneyImg from "../assets/forest.jpg";
import multifloraImg from "../assets/multiflora.jpg";
import jamunHoneyImg from "../assets/jamun.jpg";
import soapnutImg from "../assets/soapnut.jpg";
import shikakaiImg from "../assets/shikakai.jpg";
import coffeeImg from "../assets/filter.jpg";
import instantImg from "../assets/instant.jpg";
import besan from "../assets/besen.jpg";
import corn from "../assets/corn.jpg";
import ragi from "../assets/ragi.jpg";
import wheat from "../assets/wheat.jpg";
import ulava from "../assets/ulava.jpg";
import palm from "../assets/Palm.jpg";
import rice from "../assets/rice.jpg";
import arikalu from "../assets/arikalu.jpg";
import udhalu from "../assets/udhalu.jpg";
import korralu from "../assets/korralu.jpg";
import Andu from "../assets/andu.jpg";
import samalu from "../assets/samulu.jpg";
import tella from "../assets/tellajonna.jpg";
import pacha from "../assets/pacchajonna.jpg";
import sajjalu from "../assets/sajjalu.jpg";
import ragimillet from "../assets/ragimillet.jpg";
import godhuma from "../assets/godumulu.jpg";
import voorigaley from "../assets/foxtail.jpg";
import brownrice from "../assets/brownrice.jpg";
import fennel from "../assets/fennel.jpg";
import dhaniya from "../assets/dhaniya.jpg";
import fenu from "../assets/fenu.jpg";
import garam from "../assets/garammasala.jpg";
import kandi from "../assets/kandipodi.jpg";
import karivepaku from "../assets/karevepaku.jpg";
import putnala from "../assets/putnalapodi.jpg";
import pesarapappu from "../assets/pesarapodi.jpg";
import jeera from "../assets/jeera.jpg";
import groundnut from "../assets/groundnut.jpg";
import sesame from "../assets/sesame.jpg";
import blacksesame from "../assets/blacksesame.jpg";
import coconut from "../assets/coconut.jpg";
import mustard from "../assets/mustard.jpg";
import sunflower from "../assets/sun.jpg";
import sambhar from "../assets/sambar.jpg";
import ground from "../assets/ground.jpg";
export const CATEGORIES = [
  "All", "Cold Pressed Oils", "Powders", "Millets",
  "Flours", "Coffee", "Shampoo", "Juice", "Honey",
];

export const CATEGORY_ICONS = {
  "All": "🛒",
  "Cold Pressed Oils": "🫙",
  "Powders": "🌿",
  "Millets": "🌾",
  "Flours": "🌾",
  "Coffee": "☕",
  "Shampoo": "🧴",
  "Juice": "🥤",
  "Honey": "🍯",
};

//  const OIL_IMG = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80";
// const POWDER_IMG = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80";
// const MILLET_IMG = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80";
// const FLOUR_IMG = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80";
// const COFFEE_IMG = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80";
// const SHAMPOO_IMG = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80";
const JUICE_IMG = "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80";
// const HONEY_IMG = "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80";

export const PRODUCTS = [
  // ───────────── COLD PRESSED OILS ─────────────
  { id: 1, name: "Sesame Oil", category: "Cold Pressed Oils", price: 320, unit: "500ml", description: "Pure cold pressed from premium sesame seeds. Rich in antioxidants and Vitamin E.", image: sesame, stock: 50, rating: 4.8, reviews: 124 },
  { id: 2, name: "Sesame Oil", category: "Cold Pressed Oils", price: 600, unit: "1 Litre", description: "Pure cold pressed sesame oil, bulk pack for everyday cooking.", image: sesame, stock: 35, rating: 4.8, reviews: 88 },
  { id: 3, name: "Sesame Oil", category: "Cold Pressed Oils", price: 2800, unit: "5 Litre", description: "Family-size cold pressed sesame oil, great value for regular households.", image: sesame, stock: 15, rating: 4.9, reviews: 31 },

  { id: 4, name: "Groundnut Oil", category: "Cold Pressed Oils", price: 280, unit: "500ml", description: "Traditional wood-pressed groundnut oil with a rich, nutty aroma.", image: ground, stock: 40, rating: 4.7, reviews: 98 },
  { id: 5, name: "Groundnut Oil", category: "Cold Pressed Oils", price: 520, unit: "1 Litre", description: "Wood-pressed groundnut oil, ideal for daily frying and cooking.", image: ground, stock: 30, rating: 4.7, reviews: 70 },
  { id: 6, name: "Groundnut Oil", category: "Cold Pressed Oils", price: 2400, unit: "5 Litre", description: "Bulk wood-pressed groundnut oil for large families and bulk cooking.", image: ground, stock: 12, rating: 4.8, reviews: 26 },

  { id: 7, name: "Black Sesame Oil", category: "Cold Pressed Oils", price: 350, unit: "500ml", description: "Cold pressed from roasted black sesame seeds, known for its deep flavour and nutrition.", image: blacksesame, stock: 25, rating: 4.8, reviews: 41 },
  { id: 8, name: "Black Sesame Oil", category: "Cold Pressed Oils", price: 650, unit: "1 Litre", description: "Cold pressed black sesame oil, perfect for traditional recipes and massage use.", image: blacksesame, stock: 18, rating: 4.9, reviews: 22 },

  { id: 9, name: "Coconut Oil", category: "Cold Pressed Oils", price: 350, unit: "500ml", description: "Virgin cold pressed coconut oil, unrefined and chemical-free.", image: coconut, stock: 35, rating: 4.9, reviews: 201 },
  { id: 10, name: "Coconut Oil", category: "Cold Pressed Oils", price: 650, unit: "1 Litre", description: "Virgin cold pressed coconut oil, ideal for cooking, skin and hair care.", image: coconut, stock: 28, rating: 4.9, reviews: 142 },

  { id: 11, name: "Mustard Oil", category: "Cold Pressed Oils", price: 260, unit: "500ml", description: "Pungent and pure cold pressed mustard oil for authentic cooking.", image: mustard, stock: 60, rating: 4.6, reviews: 77 },
  { id: 12, name: "Mustard Oil", category: "Cold Pressed Oils", price: 480, unit: "1 Litre", description: "Pure cold pressed mustard oil, strong aroma, ideal for pickles and curries.", image: mustard, stock: 40, rating: 4.6, reviews: 53 },

  { id: 13, name: "Sunflower Oil", category: "Cold Pressed Oils", price: 130, unit: "500ml", description: "Light and healthy cold pressed sunflower oil for daily cooking.", image: sunflower, stock: 65, rating: 4.5, reviews: 40 },
  { id: 14, name: "Sunflower Oil", category: "Cold Pressed Oils", price: 240, unit: "1 Litre", description: "Light and healthy cold pressed sunflower oil for daily cooking.", image: sunflower, stock: 45, rating: 4.5, reviews: 63 },

  // ───────────── POWDERS ─────────────
  { id: 15, name: "Somp Powder (Fennel)", category: "Powders", price: 120, unit: "200g", description: "Freshly ground fennel powder for digestion and flavouring.", image: fennel, stock: 80, rating: 4.7, reviews: 55 },
  { id: 16, name: "Dhaniya Powder (Coriander)", category: "Powders", price: 90, unit: "200g", description: "Sun-dried and freshly ground coriander powder.", image: dhaniya, stock: 100, rating: 4.6, reviews: 48 },
  { id: 17, name: "Avise Ginjalu Powder (Fenugreek Seeds)", category: "Powders", price: 100, unit: "200g", description: "Roasted fenugreek seed powder, traditionally used for flavour and health benefits.", image: fenu, stock: 60, rating: 4.5, reviews: 29 },
  { id: 18, name: "Garam Masala", category: "Powders", price: 150, unit: "100g", description: "Traditional blend of whole spices, slow-roasted and ground fresh.", image: garam, stock: 70, rating: 4.8, reviews: 89 },
  { id: 19, name: "Kandi Podi (Toor Dal Powder)", category: "Powders", price: 130, unit: "200g", description: "Roasted toor dal spice powder, perfect with hot rice and ghee.", image: kandi, stock: 65, rating: 4.7, reviews: 52 },
  { id: 20, name: "Karivepaku Podi (Curry Leaves Powder)", category: "Powders", price: 90, unit: "100g", description: "Fresh curry leaves dried and ground into a fragrant, nutritious powder.", image: karivepaku, stock: 75, rating: 4.6, reviews: 37 },
  { id: 21, name: "Putnala Karam Podi (Roasted Gram Chutney Powder)", category: "Powders", price: 110, unit: "200g", description: "Roasted gram chutney powder with a spicy, nutty flavour.", image: putnala, stock: 70, rating: 4.6, reviews: 33 },
  { id: 22, name: "Sambar Powder", category: "Powders", price: 140, unit: "200g", description: "Authentic blend of lentils and spices for traditional South Indian sambar.", image: sambhar, stock: 85, rating: 4.8, reviews: 67 },
  { id: 23, name: "Groundnut Chutney Powder", category: "Powders", price: 120, unit: "200g", description: "Roasted groundnut chutney powder, a popular accompaniment for idli and dosa.", image: groundnut, stock: 75, rating: 4.7, reviews: 44 },
  { id: 24, name: "Pesarapappu Podi (Moong Dal Powder)", category: "Powders", price: 110, unit: "200g", description: "Roasted moong dal spice powder with a mild, comforting flavour.", image: pesarapappu, stock: 60, rating: 4.6, reviews: 28 },
  { id: 25, name: "Jeera Powder (Cumin)", category: "Powders", price: 140, unit: "100g", description: "Freshly roasted and ground cumin powder for everyday cooking.", image: jeera, stock: 90, rating: 4.7, reviews: 58 },

  // ───────────── MILLETS ─────────────
  { id: 26, name: "Arikalu (Little Millet)", category: "Millets", price: 110, unit: "1 kg", description: "High-fibre little millet, a nutritious alternative to rice.", image: arikalu, stock: 90, rating: 4.7, reviews: 42 },
  { id: 27, name: "Arikalu (Little Millet)", category: "Millets", price: 60, unit: "500g", description: "High-fibre little millet, ideal for small households.", image: arikalu, stock: 100, rating: 4.7, reviews: 25 },
  { id: 28, name: "Udhalu (Barnyard Millet)", category: "Millets", price: 115, unit: "1 kg", description: "Protein-rich barnyard millet, easy to digest and great for porridge.", image: udhalu, stock: 85, rating: 4.6, reviews: 39 },
  { id: 29, name: "Udhalu (Barnyard Millet)", category: "Millets", price: 65, unit: "500g", description: "Protein-rich barnyard millet in a convenient half-kilo pack.", image: udhalu, stock: 95, rating: 4.6, reviews: 21 },
  { id: 30, name: "Korralu (Foxtail Millet)", category: "Millets", price: 105, unit: "1 kg", description: "Light, easy-to-digest foxtail millet, popular for upma and khichdi.", image: korralu, stock: 90, rating: 4.7, reviews: 47 },
  { id: 31, name: "Korralu (Foxtail Millet)", category: "Millets", price: 55, unit: "500g", description: "Foxtail millet in a convenient half-kilo pack.", image: korralu, stock: 100, rating: 4.7, reviews: 30 },
  { id: 32, name: "Andu Korralu (Kodo Millet)", category: "Millets", price: 110, unit: "1 kg", description: "Kodo millet, rich in fibre and ideal for weight management diets.", image: Andu, stock: 80, rating: 4.6, reviews: 34 },
  { id: 33, name: "Andu Korralu (Kodo Millet)", category: "Millets", price: 60, unit: "500g", description: "Kodo millet in a convenient half-kilo pack.", image: Andu, stock: 90, rating: 4.6, reviews: 19 },
  { id: 34, name: "Saamalu (Little Millet)", category: "Millets", price: 105, unit: "1 kg", description: "Nutritious little millet variety, great for rice substitutes.", image: samalu, stock: 85, rating: 4.7, reviews: 36 },
  { id: 35, name: "Saamalu (Little Millet)", category: "Millets", price: 55, unit: "500g", description: "Little millet in a convenient half-kilo pack.", image: samalu, stock: 95, rating: 4.7, reviews: 22 },
  { id: 36, name: "Tella Jonnalu (White Sorghum)", category: "Millets", price: 90, unit: "1 kg", description: "White sorghum (jowar), perfect for rotis and traditional dishes.", image: tella, stock: 100, rating: 4.6, reviews: 41 },
  { id: 37, name: "Tella Jonnalu (White Sorghum)", category: "Millets", price: 50, unit: "500g", description: "White sorghum in a convenient half-kilo pack.", image: tella, stock: 110, rating: 4.6, reviews: 24 },
  { id: 38, name: "Pacha Jonnalu (Yellow Sorghum)", category: "Millets", price: 95, unit: "1 kg", description: "Yellow sorghum, slightly sweet and rich in antioxidants.", image: pacha, stock: 95, rating: 4.6, reviews: 33 },
  { id: 39, name: "Pacha Jonnalu (Yellow Sorghum)", category: "Millets", price: 50, unit: "500g", description: "Yellow sorghum in a convenient half-kilo pack.", image: pacha, stock: 105, rating: 4.6, reviews: 18 },
  { id: 40, name: "Sajjalu (Pearl Millet)", category: "Millets", price: 85, unit: "1 kg", description: "Pearl millet (bajra), an iron-rich staple for rotis and porridge.", image: sajjalu, stock: 100, rating: 4.7, reviews: 50 },
  { id: 41, name: "Sajjalu (Pearl Millet)", category: "Millets", price: 45, unit: "500g", description: "Pearl millet in a convenient half-kilo pack.", image: sajjalu, stock: 110, rating: 4.7, reviews: 27 },
  { id: 42, name: "Avirao Rice (Brown Rice)", category: "Millets", price: 120, unit: "1 kg", description: "Unpolished brown rice, retaining natural fibre and nutrients.", image: brownrice, stock: 70, rating: 4.8, reviews: 58 },
  { id: 43, name: "Avirao Rice (Brown Rice)", category: "Millets", price: 65, unit: "500g", description: "Unpolished brown rice in a convenient half-kilo pack.", image: brownrice, stock: 85, rating: 4.8, reviews: 31 },
  { id: 44, name: "Ragi (Finger Millet)", category: "Millets", price: 95, unit: "1 kg", description: "Calcium-rich ragi perfect for porridge, rotis and health drinks.", image: ragimillet, stock: 120, rating: 4.8, reviews: 76 },
  { id: 45, name: "Ragi (Finger Millet)", category: "Millets", price: 50, unit: "500g", description: "Calcium-rich ragi in a convenient half-kilo pack.", image: ragimillet, stock: 130, rating: 4.8, reviews: 40 },
  { id: 46, name: "Godhumalu (Whole Wheat)", category: "Millets", price: 75, unit: "1 kg", description: "Whole wheat grain, stone-ground for chapatis and rotis.", image: godhuma, stock: 100, rating: 4.6, reviews: 45 },
  { id: 47, name: "Voorigaley (Foxtail Millet Flakes)", category: "Millets", price: 90, unit: "500g", description: "Flattened foxtail millet flakes, quick to cook for upma and breakfast bowls.", image: voorigaley, stock: 60, rating: 4.6, reviews: 23 },

  // ───────────── FLOURS ─────────────
  { id: 48, name: "Ulava Flour (Horsegram)", category: "Flours", price: 100, unit: "1 kg", description: "Stone-ground horsegram flour, rich in protein and traditionally used for soups.", image: ulava, stock: 70, rating: 4.6, reviews: 32 },
  { id: 49, name: "Besan Flour", category: "Flours", price: 85, unit: "1 kg", description: "Fresh chickpea flour milled from high-quality Bengal gram.", image: besan, stock: 95, rating: 4.7, reviews: 53 },
  { id: 50, name: "Corn Flour", category: "Flours", price: 90, unit: "1 kg", description: "Finely milled corn flour, ideal for thickening and baking.", image: corn, stock: 80, rating: 4.5, reviews: 29 },
  { id: 51, name: "Ragi Flour", category: "Flours", price: 100, unit: "1 kg", description: "Stone-ground ragi flour for rotis, dosas and baked goods.", image: ragi, stock: 85, rating: 4.6, reviews: 61 },
  { id: 52, name: "Ragi Malt", category: "Flours", price: 140, unit: "500g", description: "Roasted ragi malt powder, perfect for a quick and healthy drink.", image: ragi, stock: 65, rating: 4.7, reviews: 38 },
  { id: 53, name: "Rice Flour", category: "Flours", price: 70, unit: "1 kg", description: "Finely ground rice flour for idli, dosa and traditional sweets.", image: rice, stock: 100, rating: 4.6, reviews: 47 },
  { id: 54, name: "Godhuma Flour (Wheat Flour)", category: "Flours", price: 60, unit: "1 kg", description: "Stone-ground whole wheat flour for soft chapatis and rotis.", image: wheat, stock: 110, rating: 4.7, reviews: 64 },
  { id: 55, name: "Palm Jaggery Powder", category: "Flours", price: 150, unit: "500g", description: "Natural palm jaggery powder, a healthy substitute for refined sugar.", image: palm, stock: 55, rating: 4.8, reviews: 49 },

  // ───────────── COFFEE ─────────────
  { id: 56, name: "Instant Coffee (100% Pure)", category: "Coffee", price: 220, unit: "100g", description: "South Indian blend instant coffee with rich aroma and bold taste.", image: instantImg, stock: 60, rating: 4.5, reviews: 88 },
  { id: 57, name: "Instant Coffee (100% Pure)", category: "Coffee", price: 120, unit: "50g", description: "100% pure instant coffee in a convenient travel-friendly pack.", image: instantImg, stock: 80, rating: 4.5, reviews: 41 },
  { id: 58, name: "Instant Coffee (60-40 Blend)", category: "Coffee", price: 180, unit: "100g", description: "Balanced coffee-chicory blend with a smooth, mild taste.", image: instantImg, stock: 65, rating: 4.4, reviews: 52 },
  { id: 59, name: "Instant Coffee (60-40 Blend)", category: "Coffee", price: 100, unit: "50g", description: "Coffee-chicory blend in a convenient travel-friendly pack.", image: instantImg, stock: 85, rating: 4.4, reviews: 27 },
  { id: 60, name: "Filter Coffee (100%)", category: "Coffee", price: 280, unit: "200g", description: "Premium Coorg arabica filter coffee for a rich, traditional brew.", image: coffeeImg, stock: 55, rating: 4.9, reviews: 143 },
  { id: 61, name: "Filter Coffee (60-40 Blend)", category: "Coffee", price: 240, unit: "200g", description: "Coffee-chicory blend filter coffee with a smooth, mellow flavour.", image: coffeeImg, stock: 60, rating: 4.6, reviews: 68 },
  { id: 62, name: "Filter Coffee (70-30 Blend)", category: "Coffee", price: 250, unit: "200g", description: "Balanced filter coffee blend with a slightly stronger coffee profile.", image: coffeeImg, stock: 58, rating: 4.7, reviews: 54 },
  { id: 63, name: "Filter Coffee (80-20 Blend)", category: "Coffee", price: 260, unit: "200g", description: "Strong filter coffee blend for those who love a bold cup.", image: coffeeImg, stock: 50, rating: 4.8, reviews: 49 },

  // ───────────── SHAMPOO ─────────────
  { id: 64, name: "Soap Nut Shampoo", category: "Shampoo", price: 400, unit: "500ml", description: "Natural reetha-based shampoo for strong, shiny hair without chemicals.", image: soapnutImg, stock: 30, rating: 4.6, reviews: 37 },
  { id: 65, name: "Soap Nut Shampoo", category: "Shampoo", price: 120, unit: "100ml", description: "Natural reetha-based shampoo in a travel-friendly size.", image: soapnutImg, stock: 50, rating: 4.6, reviews: 19 },
  { id: 66, name: "Shikakai Shampoo", category: "Shampoo", price: 199, unit: "100ml", description: "Ayurvedic shikakai and amla blend for scalp health and hair growth.", image: shikakaiImg, stock: 45, rating: 4.7, reviews: 44 },
  { id: 67, name: "Shikakai Shampoo", category: "Shampoo", price: 110, unit: "50ml", description: "Ayurvedic shikakai and amla shampoo in a compact travel size.", image: shikakaiImg, stock: 60, rating: 4.7, reviews: 22 },

  // ───────────── JUICE ─────────────
  { id: 68, name: "Triphala Juice", category: "Juice", price: 180, unit: "500ml", description: "Authentic triphala extract for digestion, immunity and detox.", image: JUICE_IMG, stock: 30, rating: 4.8, reviews: 92 },

  // ───────────── HONEY ─────────────
  { id: 69, name: "Forest Honey", category: "Honey", price: 450, unit: "500g", description: "Raw, unprocessed wild honey sourced directly from tribal beekeepers.", image: forestHoneyImg, stock: 25, rating: 4.9, reviews: 176 },
  { id: 70, name: "Multiflora Honey", category: "Honey", price: 380, unit: "500g", description: "Pure multiflora honey collected from a variety of wildflowers.", image: multifloraImg, stock: 35, rating: 4.7, reviews: 64 },
  { id: 71, name: "Jamun Honey", category: "Honey", price: 420, unit: "500g", description: "Raw jamun blossom honey, known for its distinct taste and health benefits.", image: jamunHoneyImg, stock: 28, rating: 4.8, reviews: 51 },
];