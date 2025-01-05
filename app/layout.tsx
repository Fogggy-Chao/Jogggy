import type { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { graphik } from "./components/fonts/fonts";
import "./globals.css";
import { Toaster } from "sonner"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    template: "%s | Jogggy",
    default: "Jogggy",
  },
  description: "Made by Jogggy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${graphik.variable}`}
      >
        {children}
        <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}
