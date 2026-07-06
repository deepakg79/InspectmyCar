"use client";

import Image from "next/image";
import Link from "next/link";

type RelatedBlog = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    heroImage?: string;
    readTime: string;
};

type Props = {
    title: string;
    excerpt: string;
    heroImage?: string | null;
    content: string;
    relatedBlogs?: RelatedBlog[];
};

export default function BlogRenderer({
    title,
    excerpt,
    heroImage,
    content,
    relatedBlogs,
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
                {/* Related Articles */}

                {relatedBlogs && relatedBlogs.length > 0 && (
                    <section className="mt-24 border-t border-slate-200 pt-16">

                        <h2 className="text-3xl font-bold text-slate-900 mb-10">

                            Related Articles

                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">

                            {relatedBlogs.map((blog) => (

                                <Link
                                    key={blog.slug}
                                    href={`/blogs/${blog.slug}`}
                                    className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >

                                    {blog.heroImage && (

                                        <div className="overflow-hidden">

                                            <Image
                                                src={blog.heroImage}
                                                alt={blog.title}
                                                width={800}
                                                height={450}
                                                className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                        </div>

                                    )}

                                    <div className="p-6">

                                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-4">

                                            {blog.category}

                                        </span>

                                        <h3 className="text-xl font-bold leading-snug group-hover:text-indigo-600 transition">

                                            {blog.title}

                                        </h3>

                                        <p className="mt-3 text-slate-600 line-clamp-2">

                                            {blog.excerpt}

                                        </p>

                                        <div className="mt-6 flex items-center justify-between">

                                            <span className="text-sm text-slate-500">

                                                {blog.readTime}

                                            </span>

                                            <span className="text-indigo-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">

                                                Read Article →

                                            </span>

                                        </div>

                                    </div>

                                </Link>

                            ))}

                        </div>

                    </section>

                )}
            </section>

        </main>

    );

}