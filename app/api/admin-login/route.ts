import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey) {
      console.error("ADMIN_KEY is not configured on the server.");

      return NextResponse.json(
        { success: false, message: "Admin login is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const password = body?.password;

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    if (password !== adminKey) {
      return NextResponse.json(
        { success: false, message: "Invalid admin password." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to process admin login." },
      { status: 500 }
    );
  }
}