"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
export default function WhatsAppButton() {
    const phone = "919975934213";
    const message = encodeURIComponent(
        "I'm planning to buy a car and would like an expert inspection before making the decision. Can you help?"
    );

    return (
        <Link
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"

            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            style={{
                right: "var(--wa-right)",
                bottom: "var(--wa-bottom)",
            }}
            className="fixed z-50"
        >
            <div className="relative flex h-14 w-14 items-center justify-center">
                <div className="whatsapp-ring" />

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110">
                    <FaWhatsapp size={30} />
                </div>
            </div>
        </Link>
    );
}