import { Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Export the font className
export const poppinsClassName = poppins.className;

export const poppinsFontFamily = poppins.style.fontFamily; // Extract the font-family string
