import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
    title:
        "Top 10 Mistakes to Avoid While Buying a Car in Pune (2026 Guide)",
    description:
        "Buying a new or used car in Pune? Avoid these 10 costly mistakes. Learn why professional inspections and PDI can save you from expensive surprises.",
    alternates: {
        canonical:
            "https://inspectmycar.in/top-10-mistakes-while-buying-car-in-pune",
    },
    openGraph: {
        title:
            "Top 10 Mistakes While Buying a New or Used Car in Pune",
        description:
            "Avoid costly mistakes when buying a new or used car in Pune with expert inspection advice.",
        url: "https://inspectmycar.in/top-10-mistakes-while-buying-car-in-pune",
        siteName: "InspectMyCar",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_IN",
        type: "article",
    },
};

export default function Page() {
    return <PageClient />;
}