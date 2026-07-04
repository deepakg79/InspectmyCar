import { NextResponse } from "next/server";

export function GET() {
    const baseUrl = "https://inspectmycar.in";
    const now = new Date().toISOString();

    const staticRoutes = [
        "",

        // Main Landing Pages
        "/new-cars",
        "/used-cars",

        // New Cars
        "/new-cars/pdi-pune",
        "/new-cars/checklist",
        "/new-cars/buying-guide",
        "/new-cars/pdi-checklist-for-new-car",

        // Used Cars
        "/used-cars/pdi-pune",
        "/used-cars/checklist",
        "/used-cars/buying-guide",
        "/used-cars/car-delivery-checklist-pune",

        // General
        "/track",
        "/login",
        "/cancellation",
        "/faqs",
        "/privacy",
        "/terms",
        "/info/pricing",
    ];

    const brands = ["maruti", "hyundai", "tata", "mahindra", "kia", "toyota", "skoda", "volkswagen"];

    const urls = [
        ...staticRoutes.map(route => `${baseUrl}${route}`),
        ...brands.map(brand => `${baseUrl}/pdi/${brand}`)
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
<url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl
            ? "1.0"
            : url.includes("/new-cars") || url.includes("/used-cars")
                ? "0.9"
                : "0.8"
        }</priority>
</url>`).join('')}
</urlset>`.trim();

    return new NextResponse(sitemapXml, {
        headers: { "Content-Type": "application/xml" },
    });
}
