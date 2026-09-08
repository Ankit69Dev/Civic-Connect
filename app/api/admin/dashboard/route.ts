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
    // CURRENT USER
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
    // MY COMPLAINTS
    // -----------------------------------------

    const complaints = await sql`
      SELECT
        i.id,
        i.title,
        i.description,
        d.name AS category,
        i.address,
        i.latitude,
        i.longitude,
        i.priority,
        i.status,
        i.created_at,
        i.resolved_at
      FROM issues i

      LEFT JOIN departments d
        ON d.id = i.department_id

      WHERE i.reporter_id = ${userId}

      ORDER BY i.created_at DESC

      LIMIT 10
    `;

    // -----------------------------------------
    // ALL COMMUNITY ISSUES
    //
    // These are used for the Leaflet map.
    // We only return issues that have coordinates.
    // -----------------------------------------

    const mapIssues = await sql`
      SELECT
        i.id,
        i.title,
        i.description,
        d.name AS category,
        i.address,
        i.latitude,
        i.longitude,
        i.priority,
        i.status,
        i.created_at
      FROM issues i

      LEFT JOIN departments d
        ON d.id = i.department_id

      WHERE
        i.latitude IS NOT NULL
        AND i.longitude IS NOT NULL

      ORDER BY i.created_at DESC

      LIMIT 100
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
    // ISSUES SUPPORTED
    // -----------------------------------------

    const supportedResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM issue_upvotes
      WHERE user_id = ${userId}
    `;

    // -----------------------------------------
    // RESOLVED COMPLAINTS
    // -----------------------------------------

    const resolvedResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM issues
      WHERE
        reporter_id = ${userId}
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
              EPOCH FROM (
                resolved_at - created_at
              )
            ) / 86400
          ),
          0
        ) AS average_days

      FROM issues

      WHERE
        reporter_id = ${userId}
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
        id: String(user.id),
        name: user.name || "Citizen",
        email: user.email || "",
        role: user.role || "citizen",
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

        description:
          complaint.description || "",

        category:
          complaint.category || "Civic Issue",

        location:
          complaint.address ||
          "Location not provided",

        latitude:
          complaint.latitude !== null
            ? Number(complaint.latitude)
            : null,

        longitude:
          complaint.longitude !== null
            ? Number(complaint.longitude)
            : null,

        priority:
          complaint.priority || "normal",

        status:
          complaint.status || "reported",

        createdAt:
          complaint.created_at,

        resolvedAt:
          complaint.resolved_at,
      })),

      // ---------------------------------------
      // MAP ISSUES
      // ---------------------------------------

      mapIssues: mapIssues.map((issue) => ({
        id: String(issue.id),

        title: issue.title,

        description:
          issue.description || "",

        category:
          issue.category || "Civic Issue",

        location:
          issue.address ||
          "Location not provided",

        latitude:
          Number(issue.latitude),

        longitude:
          Number(issue.longitude),

        priority:
          issue.priority || "normal",

        status:
          issue.status || "reported",

        createdAt:
          issue.created_at,
      })),
    });

  } catch (error) {
    console.error(
      "Dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}