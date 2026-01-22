import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/app/ui/components/navbar";
import Footer from "@/app/ui/components/footer";
import "./globals.css";

const FRONTEND_URL_ENV: string = process.env.NEXT_PUBLIC_FRONTEND_URL || "";
const FRONTEND_PORT_ENV: string = process.env.NEXT_PUBLIC_PORT || "";
const defaultUrl: string =
  FRONTEND_URL_ENV?.includes("https://")
    ? FRONTEND_URL_ENV
    : FRONTEND_URL_ENV
    ? `${FRONTEND_URL_ENV}:${FRONTEND_PORT_ENV}`
    : "http://localhost:3000/";


export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Urban AI Lab UC",
  description: "Web page for the Urban AI Lab at Pontificia Universidad Católica de Chile",
};

const geistSans = Geist({ variable: "--font-geist-sans", display: "swap", subsets: ["latin"],});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar/>
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
