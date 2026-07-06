"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BlogEditor from "@/app/components/blog-editor/BlogEditor";
import BlogRenderer from "@/app/components/blog/BlogRenderer";

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
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

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const [saving, setSaving] =
        useState(false);

    const [showPreview, setShowPreview] =
        useState(false);

    const [heroPreview, setHeroPreview] =
        useState<string | null>(
            initialData?.heroImage ?? null
        );
    const [draft, setDraft] =
        useState<BlogDraft>({
            title: initialData?.title ?? "",
            slug: initialData?.slug ?? "",
            excerpt: initialData?.excerpt ?? "",
            content: initialData?.content ?? "",
            category: initialData?.category ?? "Buying Guide",
            heroImage: initialData?.heroImage ?? null,

            seo: {
                title:
                    initialData?.seo?.title ??
                    initialData?.seoTitle ??
                    initialData?.title ??
                    "",

                description:
                    initialData?.seo?.description ??
                    initialData?.seoDescription ??
                    initialData?.excerpt ??
                    "",
            },
        });

    function update<K extends keyof BlogDraft>(
        key: K,
        value: BlogDraft[K]
    ) {

        setDraft(prev => ({
            ...prev,
            [key]: value,
        }));

    }

    const generatedSlug =
        useMemo(() => {

            if (draft.slug.trim())
                return draft.slug;

            return slugify(draft.title);

        }, [
            draft.slug,
            draft.title,
        ]);

    const heroImageName =
        draft.heroImage instanceof File
            ? draft.heroImage.name
            : typeof draft.heroImage === "string"
                ? draft.heroImage.split("/").pop() ?? ""
                : "";

    const readTime =
        Math.max(
            1,
            Math.ceil(
                draft.content
                    .replace(/<[^>]+>/g, "")
                    .split(/\s+/)
                    .filter(Boolean)
                    .length / 220
            )
        );

    async function handlePublish() {

        if (!draft.title.trim()) {
            toast.warning("Please enter a blog title.");
            return;
        }

        if (!draft.excerpt.trim()) {
            toast.warning("Please enter a blog excerpt.");
            return;
        }

        if (!draft.category) {
            toast.warning("Please choose a category.");
            return;
        }

        if (
            draft.content
                .replace(/<[^>]+>/g, "")
                .trim()
                .length < 50
        ) {
            toast.warning("Please write your article.");
            return;
        }

        setSaving(true);

        try {

            let heroImage =
                typeof draft.heroImage === "string"
                    ? draft.heroImage
                    : "";

            if (draft.heroImage instanceof File) {

                const form = new FormData();

                form.append(
                    "file",
                    draft.heroImage
                );

                form.append(
                    "slug",
                    editMode
                        ? draft.slug
                        : generatedSlug
                );

                const upload =
                    await fetch(
                        "/api/blog/upload-image",
                        {
                            method: "POST",
                            body: form,
                        }
                    );

                if (!upload.ok) {
                    throw new Error(
                        "Image upload failed."
                    );
                }

                const image =
                    await upload.json();

                heroImage = image.url;

            }

            const response =
                await fetch(

                    editMode
                        ? "/api/blog/update"
                        : "/api/blog/publish",

                    {

                        method:
                            editMode
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({

                            slug:
                                editMode
                                    ? draft.slug
                                    : generatedSlug,

                            title: draft.title,

                            excerpt: draft.excerpt,

                            category: draft.category,

                            heroImage,

                            content: draft.content,

                            seoTitle:
                                draft.seo.title ||
                                draft.title,

                            seoDescription:
                                draft.seo.description ||
                                draft.excerpt,

                            readTime:
                                `${readTime} min read`,

                        }),

                    }

                );
            const result =
                await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ??
                    "Unable to save blog."
                );

            }
            toast.success(
                editMode
                    ? "Blog updated successfully!"
                    : "Blog published successfully!"
            );
            await new Promise(resolve =>
                setTimeout(resolve, 1200)
            );

            router.push(
                `/blogs/${editMode
                    ? draft.slug
                    : generatedSlug
                }`
            );

        } catch (err) {

            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );

        } finally {

            setSaving(false);

        }

    }

    function handlePreview() {

        setShowPreview(prev => !prev);

    }

    return (

        <main className="bg-main min-h-screen">

            <section className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="heading text-4xl mb-10">

                    {editMode
                        ? "Edit Blog"
                        : "Create Blog"}

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
                        onChange={(e) => {

                            const title =
                                e.target.value;

                            setDraft(prev => ({

                                ...prev,

                                title,

                                seo: {

                                    ...prev.seo,

                                    title:
                                        prev.seo.title ||
                                        title,

                                },

                            }));

                        }}
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
                            update(
                                "slug",
                                e.target.value
                            )
                        }
                    />

                </div>

                {/* EXCERPT */}

                <div className="mb-8">

                    <label className="font-semibold">

                        Excerpt

                    </label>

                    <textarea
                        rows={3}
                        className="mt-2 w-full rounded-xl border p-4"
                        placeholder="Short summary shown on blog cards..."
                        value={draft.excerpt}
                        onChange={(e) => {

                            const excerpt =
                                e.target.value;

                            setDraft(prev => ({

                                ...prev,

                                excerpt,

                                seo: {

                                    ...prev.seo,

                                    description:
                                        prev.seo.description ||
                                        excerpt,

                                },

                            }));

                        }}
                    />

                </div>

                {/* CATEGORY */}

                <div className="mb-8">

                    <label className="font-semibold">

                        Category

                    </label>

                    <select
                        value={draft.category}
                        onChange={(e) =>
                            update(
                                "category",
                                e.target.value
                            )
                        }
                        className="modern-input mt-2"
                    >

                        <option>
                            Buying Guide
                        </option>

                        <option>
                            Pre-Delivery Inspection
                        </option>

                        <option>
                            New Cars
                        </option>

                        <option>
                            Used Cars
                        </option>

                        <option>
                            Car Delivery
                        </option>

                        <option>
                            Car Ownership
                        </option>

                        <option>
                            Maintenance
                        </option>

                        <option>
                            Safety
                        </option>

                        <option>
                            Industry News
                        </option>

                        <option>
                            Electric Vehicles
                        </option>

                    </select>

                </div>

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

                            const file =
                                e.target.files?.[0];

                            if (!file) return;

                            update(
                                "heroImage",
                                file
                            );

                            setHeroPreview(
                                URL.createObjectURL(
                                    file
                                )
                            );

                        }}
                    />

                    {!heroPreview ? (

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="w-full h-72 rounded-3xl border-2 border-dashed border-slate-300 card-glass hover:border-indigo-500 transition flex flex-col items-center justify-center gap-4"
                        >

                            <div className="text-6xl">

                                🖼️

                            </div>

                            <div>

                                <h3 className="font-bold text-lg">

                                    Upload Hero Image

                                </h3>

                                <p className="text-slate-500 mt-1">

                                    Click to choose an image

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
                            <div className="absolute inset-x-0 bottom-0 bg-black/55 backdrop-blur-sm p-5 flex items-center justify-between">

                                <div className="text-white">

                                    <p className="font-semibold">

                                        {heroImageName || "Hero Image"}

                                    </p>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
                                    >
                                        Replace
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {

                                            update(
                                                "heroImage",
                                                null
                                            );

                                            setHeroPreview(
                                                null
                                            );

                                        }}
                                        className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* CONTENT */}

                <div className="mb-10">

                    <div className="flex items-center justify-between mb-4">

                        <label className="font-semibold">

                            Blog Content

                        </label>

                        <span className="text-sm text-slate-500">

                            Estimated read time

                            <strong className="ml-1 text-slate-700">

                                {readTime} min read

                            </strong>

                        </span>

                    </div>

                    <BlogEditor
                        value={draft.content}
                        onChange={(value) =>
                            update(
                                "content",
                                value
                            )
                        }
                    />

                </div>

                {/* SEO */}

                <div className="card-glass rounded-3xl border p-8">

                    <h2 className="heading text-2xl mb-6">

                        SEO Settings

                    </h2>

                    <div className="mb-6">

                        <label className="font-semibold">

                            SEO Title

                        </label>

                        <input
                            className="mt-2 w-full rounded-xl border p-4"
                            placeholder="SEO Title"
                            value={draft.seo.title}
                            onChange={(e) =>
                                setDraft(prev => ({

                                    ...prev,

                                    seo: {

                                        ...prev.seo,

                                        title:
                                            e.target.value,

                                    },

                                }))
                            }
                        />

                        <div className="mt-2 flex justify-end">

                            <span className="text-xs text-slate-500">

                                {draft.seo.title.length}

                                /60

                            </span>

                        </div>

                    </div>

                    <div>

                        <label className="font-semibold">

                            SEO Description

                        </label>

                        <textarea
                            rows={3}
                            className="mt-2 w-full rounded-xl border p-4"
                            placeholder="SEO Description"
                            value={draft.seo.description}
                            onChange={(e) =>
                                setDraft(prev => ({

                                    ...prev,

                                    seo: {

                                        ...prev.seo,

                                        description:
                                            e.target.value,

                                    },

                                }))
                            }
                        />

                        <div className="mt-2 flex justify-end">

                            <span className="text-xs text-slate-500">

                                {draft.seo.description.length}

                                /160

                            </span>

                        </div>

                    </div>

                </div>
                {/* ACTIONS */}

                <div className="flex items-center justify-end gap-4 mt-10">

                    <button
                        type="button"
                        onClick={handlePreview}
                        className="card-glass px-8 py-3 rounded-xl hover:scale-105 transition"
                    >
                        {showPreview
                            ? "Hide Preview"
                            : "Preview"}
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={handlePublish}
                        className="btn-primary px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >

                        {saving
                            ? (
                                editMode
                                    ? "Updating..."
                                    : "Publishing..."
                            )
                            : (
                                editMode
                                    ? "Update Blog"
                                    : "Publish Blog"
                            )}

                    </button>

                </div>

            </section>

            {showPreview && (

                <section className="border-t mt-20 pt-20 bg-white">

                    <div className="max-w-6xl mx-auto px-6">

                        <div className="mb-10">

                            <h2 className="heading text-3xl">

                                Live Preview

                            </h2>

                            <p className="text-slate-500 mt-2">

                                This is exactly how your article
                                will appear after publishing.

                            </p>

                        </div>

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