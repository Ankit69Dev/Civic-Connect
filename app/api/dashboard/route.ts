import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = session.user.id;

    // =====================================================
    // USER
    // =====================================================

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
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const user = users[0];

    // =====================================================
    // STATS
    // =====================================================

    const complaintStats = await sql`
      SELECT COUNT(*)::int AS count
      FROM issues
      WHERE reporter_id = ${userId}
    `;

    const supportedStats = await sql`
      SELECT COUNT(*)::int AS count
      FROM issue_upvotes
      WHERE user_id = ${userId}
    `;

    const resolvedStats = await sql`
      SELECT COUNT(*)::int AS count
      FROM issues
      WHERE reporter_id = ${userId}
        AND status = 'resolved'
    `;

    const averageResolution = await sql`
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
      WHERE reporter_id = ${userId}
        AND status = 'resolved'
        AND resolved_at IS NOT NULL
    `;

    // =====================================================
    // ALL COMPLAINTS
    // =====================================================

    const complaints = await sql`
      SELECT
        i.id,
        i.title,
        i.description,
        COALESCE(
          d.name,
          'General Issue'
        ) AS category,

        COALESCE(
          i.address,
          'Location unavailable'
        ) AS location,

        i.latitude,
        i.longitude,
        i.priority,
        i.status,

        i.created_at AS "createdAt",
        i.resolved_at AS "resolvedAt"

      FROM issues i

      LEFT JOIN departments d
        ON d.id = i.department_id

      WHERE i.reporter_id = ${userId}

      ORDER BY i.created_at DESC
    `;

    // =====================================================
    // MAP ISSUES
    // =====================================================

    const mapIssues = await sql`
      SELECT
        i.id,
        i.title,
        i.description,

        COALESCE(
          d.name,
          'General Issue'
        ) AS category,

        COALESCE(
          i.address,
          'Location unavailable'
        ) AS location,

        i.latitude,
        i.longitude,
        i.priority,
        i.status,

        i.created_at AS "createdAt"

      FROM issues i

      LEFT JOIN departments d
        ON d.id = i.department_id

      WHERE i.latitude IS NOT NULL
        AND i.longitude IS NOT NULL

      ORDER BY i.created_at DESC
    `;

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      stats: {
        complaints:
          Number(
            complaintStats[0]?.count ?? 0
          ),

        supported:
          Number(
            supportedStats[0]?.count ?? 0
          ),

        resolved:
          Number(
            resolvedStats[0]?.count ?? 0
          ),

        averageResolutionTime:
          `${Number(
            averageResolution[0]?.average_days ?? 0
          ).toFixed(1)} days`,
      },

      complaints,

      mapIssues,
    });
  } catch (error) {
    console.error(
      "Dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}