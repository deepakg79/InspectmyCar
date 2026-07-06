"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
    slug,
}: {
    slug: string;
}) {
    const router = useRouter();

    async function handleDelete() {

        if (!confirm("Delete this blog?")) return;

        const res = await fetch("/api/blog/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                slug,
            }),
        });

        if (res.ok) {
            router.refresh();
        } else {
            alert("Failed to delete blog.");
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
            Delete
        </button>
    );
}