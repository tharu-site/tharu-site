export type Product = {
  id: string;

  name: string;

  description: string;

  shortDescription: string;

  basePrice: string;

  originalPrice: string;

  variants: {
    black: string;
    brown: string;
  };

  specs: [string, string][];
};

export const products: Product[] = [
  {
    id: "originis-black-dial",

    name: "Originis Noctis",

    shortDescription:
      "A refined expression of balance, restraint, and modern watchmaking.",

    description:
      "A refined expression of balance, restraint, and modern watchmaking.\n\nThis watch is a limited edition with only 50 pieces available. It is available to purchase online whilst stocks last.",

    basePrice: "₦76,499",

    originalPrice: "₦90,000",

    variants: {
      black: "/blackstrapblackdial.jpg",

      brown: "/brownstrapblackdial.jpg",
    },

    specs: [
      ["Case Diameter", "40mm"],
      ["Case Height", "11mm"],
      ["Lug-to-Lug", "47mm"],
      ["Crystal", "Mineral crystal"],
      ["Case Material", "Stainless steel"],
      ["Movement", "Quartz"],
      ["Water Resistance", "3ATM Resistance"],
      ["Strap Width", "20mm"],
      ["Strap Material", "Leather"],
    ],
  },

  {
    id: "originis-white-dial",

    name: "Originis Alba",

    shortDescription:
      "A refined expression of balance, restraint, and modern watchmaking.",

    description:
      "A refined expression of balance, restraint, and modern watchmaking.\n\nThis watch is a limited edition with only 70 pieces available. It is available to purchase online whilst stocks last.",

    basePrice: "₦76,499",

    originalPrice: "₦90,000",

    variants: {
      black: "/blackstrapwhitedial.jpg",

      brown: "/brownstrapwhitedial.jpg",
    },

    specs: [
      ["Case Diameter", "40mm"],
      ["Case Height", "11mm"],
      ["Lug-to-Lug", "47mm"],
      ["Crystal", "Mineral crystal"],
      ["Case Material", "Stainless steel"],
      ["Movement", "Quartz"],
      ["Water Resistance", "3ATM Resistance"],
      ["Strap Width", "20mm"],
      ["Strap Material", "Leather"],
    ],
  },
];