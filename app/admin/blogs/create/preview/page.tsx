"use client";

import { useEffect, useState } from "react";
import BlogRenderer from "@/app/components/blog/BlogRenderer";

export default function PreviewPage() {

    const [draft, setDraft] = useState<any>();

    useEffect(() => {

        const json = sessionStorage.getItem("blog-draft");

        if (!json) return;

        setDraft(JSON.parse(json));

    }, []);

    if (!draft)
        return null;

    return (

        <BlogRenderer

            title={draft.title}

            excerpt={draft.excerpt}

            heroImage={draft.heroImage}

            content={draft.content}

        />

    );

}