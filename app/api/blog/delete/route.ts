import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";
import cloudinary from "@/app/lib/cloudinary";

export async function DELETE(req: NextRequest) {

    try {

        const { slug } = await req.json();

        const ref = adminDb
            .collection("blogs")
            .doc(slug);

        const snapshot = await ref.get();

        if (!snapshot.exists) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Blog not found.",
                },
                {
                    status: 404,
                }
            );

        }

        // Delete hero image from Cloudinary
        await cloudinary.uploader.destroy(
            `blogs/${slug}/hero`
        );

        // Delete Firestore document
        await ref.delete();

        return NextResponse.json({
            success: true,
        });

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            {
                success: false,
                message:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete blog.",
            },
            {
                status: 500,
            }
        );

    }

}