import { Figtree } from "next/font/google";

export const figtree = Figtree({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Export the font className
export const webFontClassName = figtree.className;

export const webfontFamily = figtree.style.fontFamily; // Extract the font-family string
