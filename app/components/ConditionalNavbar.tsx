"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null; // ❌ hide navbar in admin
    }

    return <Navbar />;
}