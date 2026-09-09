import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const complaints = await sql`
      SELECT
        i.id,
        i.title,
        i.description,
        COALESCE(d.name, 'General Issue') AS category,
        COALESCE(i.address, 'Location unavailable') AS location,
        i.latitude,
        i.longitude,
        i.priority,
        i.status,
        i.created_at AS "createdAt",
        i.resolved_at AS "resolvedAt",
        COALESCE(u.name, 'Unknown Citizen') AS "reporterName"
      FROM issues i
      LEFT JOIN departments d
        ON d.id = i.department_id
      LEFT JOIN users u
        ON u.id = i.reporter_id
      ORDER BY i.created_at DESC
    `;

    return NextResponse.json({
      complaints,
    });
  } catch (error) {
    console.error("All complaints API error:", error);

    return NextResponse.json(
      { error: "Failed to load complaints." },
      { status: 500 }
    );
  }
}