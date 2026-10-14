import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const citizens = await sql`
      SELECT
        u.id,
        COALESCE(u.name, 'Unnamed Citizen') AS name,
        u.email,
        u.phone,
        u.provider,
        u.created_at AS "createdAt",
        COUNT(DISTINCT i.id)::int AS "issueCount",
        COUNT(
          DISTINCT CASE
            WHEN i.status = 'resolved' THEN i.id
          END
        )::int AS "resolvedIssueCount",
        COUNT(
          DISTINCT CASE
            WHEN n.is_read = false THEN n.id
          END
        )::int AS "unreadNotificationCount"
      FROM users u
      LEFT JOIN issues i
        ON i.reporter_id = u.id
      LEFT JOIN notifications n
        ON n.user_id = u.id
      WHERE u.role = 'citizen'
      GROUP BY
        u.id,
        u.name,
        u.email,
        u.phone,
        u.provider,
        u.created_at
      ORDER BY u.created_at DESC
    `;

    const stats = await sql`
      SELECT
        COUNT(*)::int AS "totalCitizens",

        COUNT(*) FILTER (
          WHERE provider = 'google'
        )::int AS "googleCitizens",

        COUNT(*) FILTER (
          WHERE provider = 'credentials'
        )::int AS "credentialCitizens",

        COUNT(*) FILTER (
          WHERE EXISTS (
            SELECT 1
            FROM issues i
            WHERE i.reporter_id = users.id
          )
        )::int AS "reportingCitizens"

      FROM users
      WHERE role = 'citizen'
    `;

    return NextResponse.json({
      citizens,
      stats: stats[0],
    });
  } catch (error) {
    console.error("Admin citizens error:", error);

    return NextResponse.json(
      { error: "Failed to load citizens." },
      { status: 500 }
    );
  }
}