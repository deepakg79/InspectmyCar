import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();

        const file = data.get("file") as File;
        const slug = data.get("slug") as string;

        if (!file || !slug) {
            return NextResponse.json(
                { success: false },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext =
            file.name.split(".").pop() || "webp";

        const dir = path.join(
            process.cwd(),
            "public",
            "blogs",
            slug
        );

        await fs.mkdir(dir, {
            recursive: true,
        });

        const filename = `hero.${ext}`;

        await fs.writeFile(
            path.join(dir, filename),
            buffer
        );

        return NextResponse.json({
            success: true,
            url: `/blogs/${slug}/${filename}`,
        });

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );

    }
}