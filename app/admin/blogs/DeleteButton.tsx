"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
    slug,
}: {
    slug: string;
}) {

    const router = useRouter();

    const [deleting, setDeleting] =
        useState(false);

    async function handleDelete() {

        if (
            !confirm(
                "Are you sure you want to permanently delete this blog?"
            )
        ) {
            return;
        }

        setDeleting(true);

        try {

            const res = await fetch(
                "/api/blog/delete",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        slug,
                    }),
                }
            );

            if (!res.ok) {

                throw new Error();

            }

            router.refresh();

        } catch {

            alert(
                "Failed to delete the blog."
            );

        } finally {

            setDeleting(false);

        }

    }

    return (

        <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >

            {deleting
                ? "Deleting..."
                : "Delete"}

        </button>

    );

}