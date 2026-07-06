import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: NextRequest) {

    try {

        const form = await req.formData();

        const file = form.get("file") as File;

        const slug = form.get("slug") as string;

        if (!file || !slug) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Missing file or slug.",
                },
                {
                    status: 400,
                }
            );

        }

        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        const extension =
            file.name.split(".").pop() ?? "webp";

        const dataUri =
            `data:${file.type};base64,${buffer.toString("base64")}`;

        const result =
            await cloudinary.uploader.upload(
                dataUri,
                {
                    folder: `blogs/${slug}`,

                    public_id: "hero",

                    overwrite: true,

                    resource_type: "image",

                    format: extension,
                }
            );

        return NextResponse.json({

            success: true,

            url: result.secure_url,

        });

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            {
                success: false,
                message:
                    err instanceof Error
                        ? err.message
                        : "Image upload failed.",
            },
            {
                status: 500,
            }
        );

    }

}