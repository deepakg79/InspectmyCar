import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function DELETE(req: NextRequest) {

    try {

        const { slug } = await req.json();

        const contentFolder = path.join(
            process.cwd(),
            "content",
            "blogs",
            slug
        );

        const publicFolder = path.join(
            process.cwd(),
            "public",
            "blogs",
            slug
        );

        await fs.rm(
            contentFolder,
            {
                recursive: true,
                force: true,
            }
        );

        await fs.rm(
            publicFolder,
            {
                recursive: true,
                force: true,
            }
        );

        const metadataFile = path.join(
            process.cwd(),
            "content",
            "blogs",
            "metadata.json"
        );

        let metadata: any[] = [];

        try {

            metadata = JSON.parse(
                await fs.readFile(
                    metadataFile,
                    "utf8"
                )
            );

        } catch { }

        metadata = metadata.filter(
            b => b.slug !== slug
        );

        await fs.writeFile(
            metadataFile,
            JSON.stringify(metadata, null, 2)
        );

        return NextResponse.json({
            success: true,
        });

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            {
                success: false,
            },
            {
                status: 500,
            }
        );

    }

}