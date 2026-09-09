import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Get logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please log in.",
        },
        { status: 401 }
      );
    }

    // Get admin from database
    const admins = await sql`
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = ${session.user.id}
      LIMIT 1
    `;

    if (admins.length === 0) {
      return NextResponse.json(
        {
          error: "Admin user not found.",
        },
        { status: 404 }
      );
    }

    const admin = admins[0];

    // Check role from DATABASE
    if (admin.role !== "admin") {
      return NextResponse.json(
        {
          error: "Access denied. Admin privileges required.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // STATS
    // =====================================================

    const statsResult = await sql`
      SELECT
        COUNT(*)::int AS total,

        COUNT(*) FILTER (
          WHERE status = 'reported'
        )::int AS reported,

        COUNT(*) FILTER (
          WHERE status = 'in_progress'
        )::int AS "inProgress",

        COUNT(*) FILTER (
          WHERE status = 'resolved'
        )::int AS resolved,

        COUNT(*) FILTER (
          WHERE priority = 'critical'
        )::int AS critical

      FROM issues
    `;

    const stats = statsResult[0] || {
      total: 0,
      reported: 0,
      inProgress: 0,
      resolved: 0,
      critical: 0,
    };

    // =====================================================
    // ALL ISSUES
    // =====================================================

    const issues = await sql`
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

        i.priority,
        i.status,

        COALESCE(
          u.name,
          'Unknown Citizen'
        ) AS "reporterName",

        COALESCE(
          u.email,
          'No email'
        ) AS "reporterEmail",

        i.created_at AS "createdAt"

      FROM issues i

      LEFT JOIN departments d
        ON d.id = i.department_id

      LEFT JOIN users u
        ON u.id = i.reporter_id

      ORDER BY i.created_at DESC
    `;

    console.log(
      "ADMIN DASHBOARD - TOTAL ISSUES:",
      issues.length
    );

    console.log(
      "ADMIN DASHBOARD - ISSUES:",
      issues
    );

    return NextResponse.json({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },

      stats: {
        total: Number(stats.total) || 0,
        reported: Number(stats.reported) || 0,
        inProgress:
          Number(stats.inProgress) || 0,
        resolved:
          Number(stats.resolved) || 0,
        critical:
          Number(stats.critical) || 0,
      },

      issues,
    });
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load admin dashboard.",
      },
      { status: 500 }
    );
  }
}