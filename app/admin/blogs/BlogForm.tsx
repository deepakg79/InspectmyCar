// app/admin/create-blog/page.tsx

"use client";

import Image from "next/image";
import { useRef, useMemo, useState } from "react";
import BlogEditor from "@/app/components/blog-editor/BlogEditor";
import { useRouter } from "next/navigation";
import BlogRenderer from "@/app/components/blog/BlogRenderer";
function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

type BlogDraft = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    heroImage: File | string | null;

    seo: {
        title: string;
        description: string;
    };
};

type Props = {
    initialData?: any;
    editMode?: boolean;
};

export default function BlogForm({
    initialData,
    editMode = false,
}: Props) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(
        initialData?.heroImage ?? null
    );
    const [showPreview, setShowPreview] = useState(false);
    const [draft, setDraft] = useState<BlogDraft>(
        initialData ?? {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            heroImage: null,
            seo: {
                title: "",
                description: "",
            },
        }
    );

    function update<K extends keyof BlogDraft>(
        key: K,
        value: BlogDraft[K]
    ) {
        setDraft((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const generatedSlug = useMemo(() => {
        if (draft.slug.length > 0) return draft.slug;
        return slugify(draft.title);
    }, [draft.title, draft.slug]);

    async function handlePublish() {

        try {



            let heroImage =
                typeof draft.heroImage === "string"
                    ? draft.heroImage
                    : "";

            if (draft.heroImage instanceof File) {

                const form = new FormData();

                form.append("file", draft.heroImage);

                form.append("slug", generatedSlug);

                const upload = await fetch(
                    "/api/blog/upload-image",
                    {
                        method: "POST",
                        body: form,
                    }
                );

                const image = await upload.json();

                heroImage = image.url;
            }

            const publish =
                await fetch(
                    editMode
                        ? "/api/blog/update"
                        : "/api/blog/publish",
                    {
                        method: editMode ? "PUT" : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({

                            title: draft.title,

                            slug: generatedSlug,

                            excerpt: draft.excerpt,

                            category: draft.category,

                            content: draft.content,

                            heroImage,

                            seo: draft.seo,

                        }),

                    }
                );

            const result =
                await publish.json();

            if (result.success) {

                router.push(
                    "/blogs/" +
                    generatedSlug
                );

            }

        } catch (err) {

            console.error(err);

        }

    }

    function handlePreview() {
        setShowPreview((prev) => !prev);
    }

    return (
        <main className="bg-main min-h-screen">

            <section className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="heading text-4xl mb-10">
                    Create Blog
                </h1>

                {/* TITLE */}

                <div className="mb-6">

                    <label className="font-semibold">
                        Title
                    </label>

                    <input
                        className="mt-2 w-full rounded-xl border p-4"
                        placeholder="Blog title"
                        value={draft.title}
                        onChange={(e) =>
                            update("title", e.target.value)
                        }
                    />

                </div>

                {/* SLUG */}

                <div className="mb-6">

                    <label className="font-semibold">
                        Slug
                    </label>

                    <input
                        className="mt-2 w-full rounded-xl border p-4"
                        value={generatedSlug}
                        onChange={(e) =>
                            update("slug", e.target.value)
                        }
                    />

                </div>

                {/* EXCERPT */}

                <div className="mb-6">

                    <label className="font-semibold">
                        Excerpt
                    </label>

                    <textarea
                        rows={3}
                        className="mt-2 w-full rounded-xl border p-4"
                        placeholder="Short summary shown on blog cards..."
                        value={draft.excerpt}
                        onChange={(e) =>
                            update("excerpt", e.target.value)
                        }
                    />

                </div>
                <label className="font-semibold">
                    Category
                </label>

                <select
                    value={draft.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="modern-input mt-2 mb-8"
                >
                    <option>Buying Guide</option>
                    <option>Pre-Delivery Inspection</option>
                    <option>New Cars</option>
                    <option>Used Cars</option>
                    <option>Car Delivery</option>
                    <option>Car Ownership</option>
                    <option>Maintenance</option>
                    <option>Safety</option>
                    <option>Industry News</option>
                    <option>Electric Vehicles</option>
                </select>
                {/* HERO IMAGE */}

                <div className="mb-10">

                    <label className="block font-semibold mb-4">
                        Hero Image
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {

                            const file = e.target.files?.[0];

                            if (!file) return;

                            update("heroImage", file);

                            setHeroPreview(URL.createObjectURL(file));

                        }}
                    />

                    {!heroPreview ? (

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-72 border-2 border-dashed border-slate-300 rounded-3xl card-glass hover:border-indigo-500 transition flex flex-col items-center justify-center gap-4"
                        >

                            <div className="text-6xl">
                                🖼️
                            </div>

                            <div>

                                <h3 className="font-bold text-lg">
                                    Upload Hero Image
                                </h3>

                                <p className="text-slate-500 mt-1">
                                    Click here or drag & drop an image
                                </p>

                            </div>

                        </button>

                    ) : (

                        <div className="relative rounded-3xl overflow-hidden">

                            <Image
                                src={heroPreview}
                                alt="Hero Preview"
                                width={1400}
                                height={800}
                                className="w-full h-[380px] object-cover"
                            />

                            <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm p-5 flex justify-between items-center">

                                <div className="text-white">

                                    <p className="font-semibold">
                                        const heroImageName =
                                        draft.heroImage instanceof File
                                        ? draft.heroImage.name
                                        : draft.heroImage
                                        ? draft.heroImage.split("/").pop() ?? ""
                                        : "";
                                    </p>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold"
                                    >
                                        Replace
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {

                                            update("heroImage", null);

                                            setHeroPreview(null);

                                        }}
                                        className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* CONTENT */}

                <div className="mb-8">

                    <label className="font-semibold">
                        Content
                    </label>

                    {/* Replace this with Tiptap next */}

                    <BlogEditor
                        value={draft.content}
                        onChange={(value) => update("content", value)}
                    />

                </div>

                {/* SEO */}

                <div className="card-glass rounded-3xl p-8 border">

                    <h2 className="heading text-2xl mb-6">
                        SEO
                    </h2>

                    <input
                        placeholder="SEO Title"
                        className="w-full rounded-xl border p-4 mb-4"
                        value={draft.seo.title}
                        onChange={(e) =>
                            setDraft((prev) => ({
                                ...prev,
                                seo: {
                                    ...prev.seo,
                                    title: e.target.value,
                                },
                            }))
                        }
                    />

                    <textarea
                        rows={3}
                        placeholder="SEO Description"
                        className="w-full rounded-xl border p-4"
                        value={draft.seo.description}
                        onChange={(e) =>
                            setDraft((prev) => ({
                                ...prev,
                                seo: {
                                    ...prev.seo,
                                    description: e.target.value,
                                },
                            }))
                        }
                    />

                </div>

                {/* ACTIONS */}

                <div className="flex justify-end gap-4 mt-10">

                    <button
                        onClick={handlePreview}
                        className="card-glass px-8 py-3 rounded-xl"
                    >
                        Preview
                    </button>

                    <button
                        onClick={handlePublish}
                        className="btn-primary px-8 py-3"
                    >
                        {editMode ? "Update Blog" : "Publish Blog"}
                    </button>

                </div>

            </section>
            {showPreview && (

                <section className="border-t mt-20 pt-20">

                    <div className="max-w-6xl mx-auto px-6">

                        <h2 className="heading text-3xl mb-10">
                            Preview
                        </h2>

                        <BlogRenderer
                            title={draft.title}
                            excerpt={draft.excerpt}
                            heroImage={heroPreview}
                            content={draft.content}
                        />

                    </div>

                </section>

            )}
        </main>
    );
}