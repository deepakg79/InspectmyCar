"use client";

import Image from "next/image";

type Props = {
    title: string;
    excerpt: string;
    heroImage?: string | null;
    content: string;
};

export default function BlogRenderer({
    title,
    excerpt,
    heroImage,
    content,
}: Props) {

    return (

        <main className="bg-main min-h-screen">

            <section className="px-6 pt-32 pb-20 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-indigo-700">
                    {title}
                </h1>
                <p className="subtext text-xl mb-10">
                    {excerpt}
                </p>

                {heroImage && (

                    <Image
                        src={heroImage}
                        alt={title}
                        width={1400}
                        height={800}
                        priority
                        className="..."
                    />

                )}

                <article
                    className="blog-content max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                />

            </section>

        </main>

    );

}