import jollof from "../assets/dishes/jollof.webp";
import efo from "../assets/dishes/efo-riro.webp";
import asun from "../assets/dishes/asun.webp";
import spaghetti from "../assets/dishes/spaghetti.webp";
import packs from "../assets/dishes/party-packs.webp";

// Signature dishes for the landing page. The live menu comes from the API.
export const showcase = [
  {
    name: "Party jollof",
    note: "Smoky, firewood-style jollof with fried plantain and your choice of chicken, beef or fish.",
    image: jollof,
  },
  {
    name: "Efo riro & pounded yam",
    note: "Spinach stewed in palm oil with assorted meat and stockfish, served with soft pounded yam.",
    image: efo,
  },
  {
    name: "Spicy asun",
    note: "Grilled goat meat tossed in ata rodo and onions. Hot, smoky, and gone in minutes.",
    image: asun,
  },
  {
    name: "Pepper spaghetti",
    note: "Spaghetti and meatballs in a rich tomato and pepper sauce, finished with fresh basil.",
    image: spaghetti,
  },
];

export const partyPacks = packs;

export const deliveryAreas = [
  "Bodija",
  "University of Ibadan",
  "Dugbe",
  "Mokola",
  "Ring Road",
  "Challenge",
  "Iwo Road",
];

export const categories = [
  "Main Course",
  "Specials",
  "Appetizers",
  "Snacks",
  "Beverages",
  "Desserts",
  "Breakfast",
  "Lunch Combos",
  "Dinner Specials",
  "Vegan Options",
  "Extras & Add-ons",
];

export const BRAND = {
  name: "Ata Kitchen",
  short: "Ata",
  tagline: "Nigerian home cooking, delivered hot.",
  city: "Ibadan",
  hours: "Every day, 9am to 11pm",
  whatsapp: "", // e.g. "2348000000000" — add your business number to show WhatsApp links
  email: "",
};
