import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/carData.json");

// -------------------------
// SIMPLE IN-PROCESS LOCK
// (prevents same-process race)
// -------------------------
let writing = false;
let queue: (() => void)[] = [];

// wait function
function waitForUnlock(): Promise<void> {
    return new Promise((resolve) => {
        queue.push(resolve);
    });
}

// release lock
function releaseLock() {
    const next = queue.shift();
    if (next) next();
}

// -------------------------
// SAFE READ
// -------------------------
function readData() {
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("READ ERROR:", err);
        return { brands: [] };
    }
}

// -------------------------
// SAFE WRITE (ATOMIC)
// -------------------------
async function writeData(data: any) {
    // wait if another write is happening (same process)
    while (writing) {
        await waitForUnlock();
    }

    writing = true;

    try {
        const tmpPath = filePath + ".tmp";

        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
        fs.renameSync(tmpPath, filePath);
    } catch (err) {
        console.error("WRITE ERROR:", err);
        throw err;
    } finally {
        writing = false;
        releaseLock();
    }
}

// =========================
// GET
// =========================
export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

// =========================
// POST (ADD / DELETE)
// =========================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { brand, modelName, type, action, index } = body;

        const data = readData();

        const brandIndex = data.brands.findIndex(
            (b: any) => b.brand === brand
        );

        if (brandIndex === -1) {
            return NextResponse.json(
                { error: "Brand not found" },
                { status: 400 }
            );
        }

        // ----------------------
        // ADD MODEL
        // ----------------------
        if (action === "add") {
            const exists = data.brands[brandIndex].models.some(
                (m: any) =>
                    m.name.toLowerCase() === modelName.toLowerCase()
            );

            if (exists) {
                return NextResponse.json(
                    { error: "Model already exists" },
                    { status: 400 }
                );
            }

            data.brands[brandIndex].models.push({
                name: modelName,
                type,
            });
        }

        // ----------------------
        // DELETE MODEL
        // ----------------------
        if (action === "delete") {
            if (
                typeof index !== "number" ||
                !data.brands[brandIndex].models[index]
            ) {
                return NextResponse.json(
                    { error: "Invalid index" },
                    { status: 400 }
                );
            }

            data.brands[brandIndex].models.splice(index, 1);
        }

        // ----------------------
        // SAVE
        // ----------------------
        await writeData(data);

        return NextResponse.json(data);
    } catch (err) {
        console.error("API ERROR:", err);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
