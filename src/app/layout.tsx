import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Poppins } from "next/font/google";
import NextAuthProvider from "../../providers/NextAuthProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import FacebookPixelWrapper from "@/components/FacebookPixelClientWrapper";
import FacebookPageView from "@/components/FacebookPageView";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins-font",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});
export const metadata: Metadata = {
  icons: {
    icon: "/horizontal1.png",
  },
  title: "HappyTrip",
  description: "Welcome to happytrip website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative overflow-x-hidden`}>
        <FacebookPixelWrapper />
        <FacebookPageView />
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
      <GoogleAnalytics gaId="G-TT6V0GEH25" />
    </html>
  );
}
