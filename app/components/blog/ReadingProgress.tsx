"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {

    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const updateProgress = () => {

            const scrollTop = window.scrollY;

            const maxScroll =
                document.documentElement.scrollHeight -
                window.innerHeight;

            setProgress(
                maxScroll > 0
                    ? (scrollTop / maxScroll) * 100
                    : 0
            );

        };

        updateProgress();

        window.addEventListener(
            "scroll",
            updateProgress,
            { passive: true }
        );

        return () =>
            window.removeEventListener(
                "scroll",
                updateProgress
            );

    }, []);

    return (

        <div className="absolute bottom-0 left-0 w-full h-[3px]">

            <div
                className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 transition-[width] duration-150"
                style={{
                    width: `${progress}%`,
                }}
            />

        </div>

    );

}