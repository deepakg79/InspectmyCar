import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
    title: "Car Delivery Checklist Pune (2026) | Avoid Costly Mistakes",
    description:
        "Complete car delivery checklist in Pune before taking delivery. Avoid scratches, repaint issues, hidden defects and buying mistakes with our expert inspection guide.",
    keywords: [
        "car delivery checklist pune",
        "new car pdi checklist india",
        "car inspection before delivery pune",
        "pdi checklist new car",
        "used car inspection pune",
        "pre purchase inspection pune",
    ],
    alternates: {
        canonical:
            "https://inspectmycar.in/car-delivery-checklist-pune",
    },
    openGraph: {
        title: "Car Delivery Checklist Pune (2026 Guide)",
        description:
            "Complete expert checklist before taking delivery of your new or used car in Pune.",
        url: "https://inspectmycar.in/car-delivery-checklist-pune",
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