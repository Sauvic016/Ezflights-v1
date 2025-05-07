import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EzFlights",
  description: "Make flying easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} antialiased scroll-smooth bg-sky-50`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
