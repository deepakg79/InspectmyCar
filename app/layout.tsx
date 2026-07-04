// app/layout.tsx

import "../app/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import ConditionalNavbar from "@/app/components/ConditionalNavbar";
import Footer from "@/app/components/Footer";
import { BookingProvider } from "@/app/context/BookingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://inspectmycar.in"),

    title: {
        default: "InspectMyCar | Car PDI & Inspection Services in Pune",
        template: "%s | InspectMyCar",
    },

    description:
        "Professional car inspection services in Pune. Get independent Pre-Delivery Inspection (PDI) and Pre-Purchase Inspection (PPI) with 299+ checkpoints. Serving Baner, Hinjewadi, Wakad & Kharadi.",

    keywords: [
        "car inspection Pune",
        "PDI Pune",
        "pre delivery inspection Pune",
        "used car inspection Pune",
        "car mechanic inspection",
        "buy used car Pune",
        "new car inspection India",
    ],

    alternates: {
        canonical: "https://inspectmycar.in",
    },

    openGraph: {
        type: "website",
        url: "https://inspectmycar.in",
        siteName: "InspectMyCar",
        title: "InspectMyCar | Car PDI & Inspection Services in Pune",
        description:
            "Independent car inspection experts in Pune. Avoid costly mistakes with our 299+ point inspection service.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "InspectMyCar - Car Inspection Services Pune",
            },
        ],
        locale: "en_IN",
    },

    twitter: {
        card: "summary_large_image",
        title: "InspectMyCar | Car Inspection Pune",
        description:
            "Professional PDI & used car inspection in Pune with 299+ checkpoints.",
        images: ["/og-image.jpg"],
    },

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    robots: {
        index: true,
        follow: true,
    },

    category: "automotive services",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className="scroll-smooth"
            data-scroll-behavior="smooth"
        >
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