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

                <h1 className="heading text-5xl leading-tight mb-6">
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
                        className="rounded-3xl mb-10"
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