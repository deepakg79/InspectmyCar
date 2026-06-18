// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { BookingProvider } from "./context/BookingContext";
import Script from "next/script";
import ConditionalNavbar from "./components/ConditionalNavbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "InspectMyCar | Professional PDI Services Pune",
    template: "%s | InspectMyCar",
  },
  description:
    "Car PDI in Pune with 200+ checkpoint inspection. Expert pre-delivery inspection service in Baner, Hinjewadi, Wakad & Kharadi to ensure your new car is defect-free.",
  metadataBase: new URL("https://inspectmycar.in"),
  alternates: {
    canonical: "https://inspectmycar.in",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "InspectMyCar | Best PDI Services in Pune",
    description:
      "Don't take chances with your new car. Get a professional PDI in Pune today.",
    url: "https://inspectmycar.in",
    siteName: "InspectMyCar",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "InspectMyCar",
    image: "https://inspectmycar.in/logo.png",
    "@id": "https://inspectmycar.in",
    url: "https://inspectmycar.in",
    telephone: "+919975934213",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Office Address, Pune",
      addressLocality: "Pune",
      addressRegion: "MH",
      postalCode: "411045",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: 18.5204, longitude: 73.8567 },
    description:
      "Expert Car Pre-Delivery Inspection (PDI) services in Pune. We serve Hinjewadi, Baner, Wakad, and Kharadi to ensure your new car is 100% defect-free.",
    areaServed: { "@type": "City", name: "Pune" },
  };

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Favicon set */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-main antialiased`}>
        <BookingProvider>
          <ConditionalNavbar />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}