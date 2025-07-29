import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";



const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Evaluación de Conocimientos – ABIUDEA",
  description: "Espacio diseñado para validar y reconocer tus conocimientos dentro del programa ABIUDEA.",
    icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
