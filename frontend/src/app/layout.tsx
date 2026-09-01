import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/contexts/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutri Delight | Making Bhimavaram Healthy",
  description: "Order healthy food and fresh juices in Bhimavaram with Nutri Delight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white selection:bg-green-100 selection:text-green-900">
        <CartProvider>
          <Header />
          <main className="flex-1 flex flex-col w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
