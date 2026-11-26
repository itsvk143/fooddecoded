import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FoodDecode — Food Ingredient Analysis & Scanner",
    short_name: "FoodDecode",
    description:
      "Analyze packaged food labels with instant scientific precision. Detect harmful additives, ultra-processed Nova 4 ingredients, palm oil, added sugars, and allergens.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0c0a09",
    theme_color: "#10B981",
    categories: ["food", "health", "shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Scan Barcode",
        short_name: "Scanner",
        description: "Quickly scan a food barcode with your camera",
        url: "/scan",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Explore Products",
        short_name: "Products",
        description: "Browse healthy food catalogue and ingredients",
        url: "/products",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
