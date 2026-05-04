import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบรายงานข้อมูลงานบริการภาครัฐ",
  description: "Dashboard for Government Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={anuphan.className}>
      <body className="antialiased">
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-N0N990GGX7" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N0N990GGX7');
          `}
        </Script>
      </body>
    </html>
  );
}
