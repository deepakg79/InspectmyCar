import { NextResponse } from "next/server";

export function GET() {
    const content = `
User-agent: *
Allow: /
Allow: /car-pdi-pune
Allow: /book
Allow: /info/
Allow: /pdi/
Disallow: /admin/
Disallow: /inspect
Disallow: /inspector
Disallow: /login
Disallow: /track/

Sitemap: https://inspectmycar.in/sitemap.xml
`.trim();

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}