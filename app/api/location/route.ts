
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        // Works when your hosting provider supplies the visitor IP.
        // Configure trusted proxy handling for your deployment.
        const forwardedFor = request.headers.get("x-forwarded-for");
        const realIp = request.headers.get("x-real-ip");

        const ip = forwardedFor
            ?.split(",")[0]
            ?.trim() || realIp?.trim();

        // Do not use the server's own IP as the visitor's location.
        if (
            !ip ||
            ip === "127.0.0.1" ||
            ip === "::1" ||
            ip.startsWith("192.168.") ||
            ip.startsWith("10.") ||
            ip.startsWith("172.16.")
        ) {
            return NextResponse.json(
                { city: null, message: "Visitor IP unavailable" },
                { headers: { "Cache-Control": "no-store" } }
            );
        }

        const response = await fetch(
            `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
            {
                cache: "no-store",
                signal: AbortSignal.timeout(5000),
            }
        );

        if (!response.ok) {
            throw new Error("IP geolocation request failed");
        }

        const data = await response.json();

        if (data.error || !data.city) {
            return NextResponse.json(
                { city: null, message: "City not found" },
                { headers: { "Cache-Control": "no-store" } }
            );
        }

        return NextResponse.json(
            {
                city: data.city,
                region: data.region ?? null,
                country: data.country_name ?? null,
            },
            {
                headers: { "Cache-Control": "no-store" },
            }
        );
    } catch (error) {
        console.error("IP geolocation error:", error);

        return NextResponse.json(
            { city: null, message: "Location lookup failed" },
            {
                headers: { "Cache-Control": "no-store" },
            }
        );
    }
}
