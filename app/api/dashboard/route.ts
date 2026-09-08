import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // -----------------------------------------
    // USER
    // -----------------------------------------

    const users = await sql`
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = users[0];

    // -----------------------------------------
    // USER'S COMPLAINTS
    // -----------------------------------------

    const complaints = await sql`
      SELECT
        id,
        title,
        department_id,
        address,
        latitude,
        longitude,
        priority,
        status,
        created_at,
        resolved_at
      FROM issues
      WHERE reporter_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // -----------------------------------------
    // TOTAL COMPLAINTS
    // -----------------------------------------

    const complaintsResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM issues
      WHERE reporter_id = ${userId}
    `;

    // -----------------------------------------
    // SUPPORTED ISSUES
    // -----------------------------------------

    const supportedResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM issue_upvotes
      WHERE user_id = ${userId}
    `;

    // -----------------------------------------
    // RESOLVED ISSUES
    // -----------------------------------------

    const resolvedResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM issues
      WHERE reporter_id = ${userId}
        AND status = 'resolved'
    `;

    // -----------------------------------------
    // AVERAGE RESOLUTION TIME
    // -----------------------------------------

    const resolutionResult = await sql`
      SELECT
        COALESCE(
          AVG(
            EXTRACT(
              EPOCH FROM (resolved_at - created_at)
            ) / 86400
          ),
          0
        ) AS average_days
      FROM issues
      WHERE reporter_id = ${userId}
        AND status = 'resolved'
        AND resolved_at IS NOT NULL
    `;

    const averageDays = Number(
      resolutionResult[0]?.average_days ?? 0
    );

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      stats: {
        complaints: Number(
          complaintsResult[0]?.count ?? 0
        ),

        supported: Number(
          supportedResult[0]?.count ?? 0
        ),

        resolved: Number(
          resolvedResult[0]?.count ?? 0
        ),

        averageResolutionTime:
          averageDays > 0
            ? `${averageDays.toFixed(1)} days`
            : "0 days",
      },

      complaints: complaints.map((complaint) => ({
        id: String(complaint.id),

        title: complaint.title,

        category: "Civic Issue",

        location:
          complaint.address ||
          "Location not provided",

        priority: complaint.priority,

        status: complaint.status,

        createdAt: complaint.created_at,
      })),
    });

  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data",
      },
      { status: 500 }
    );
  }
}