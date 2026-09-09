import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const departments = await sql`
      SELECT
        id,
        name
      FROM departments
      ORDER BY name ASC
    `;

    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Departments API error:", error);

    return NextResponse.json(
      { error: "Failed to load departments" },
      { status: 500 }
    );
  }
}