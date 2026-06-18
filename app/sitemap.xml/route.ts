import { NextResponse } from "next/server";

export function GET() {
    const baseUrl = "https://inspectmycar.in";
    const now = new Date().toISOString();

    const staticRoutes = [
        "", "/book", "/inspect", "/track", "/login",
        "/car-pdi-pune", "/car-delivery-checklist-pune", "/pdi-checklist-for-new-car",
        "/top-10-mistakes-while-buying-car-in-pune",
        "/info/how-it-works", "/info/pricing", "/info/privacy", "/info/terms",
        "/faqs","/vindecoder"
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
  </url>`).join('')}
</urlset>`.trim();

    return new NextResponse(sitemapXml, {
        headers: { "Content-Type": "application/xml" },
    });
}
