import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paj.Cash",
  description: "Off ramp from your favorite wallet.",
  openGraph: {
    images: [
      {
        url: "https://res.cloudinary.com/dtfvdjvyr/image/upload/v1735058156/Frame_113_1_qcl4lo.png",
        width: 1200,
        height: 630,
        alt: "Paj.Cash Logo",
      },
    ],
  },
  twitter: {
    title: "Paj.Cash",
    description: "Off ramp from your favorite wallet.",
    images: [
      {
        url: "https://res.cloudinary.com/dtfvdjvyr/image/upload/v1735058156/Frame_113_1_qcl4lo.png",
        alt: "Paj.Cash Logo",
      },
    ],
    creator: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
