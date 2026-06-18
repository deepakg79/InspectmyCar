"use client";
import { useState } from "react";

export default function BrandImage({ src, alt }: { src: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-110"
            onError={() => setImgSrc("/hero-car.jpg")} // Falls back to your main hero image if brand image is missing
        />
    );
}