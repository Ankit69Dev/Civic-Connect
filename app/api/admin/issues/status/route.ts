import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function PATCH(
  request: Request
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminId = session.user.id;

    // Check admin
    const admins = await sql`
      SELECT id, role
      FROM users
      WHERE id = ${adminId}
      LIMIT 1
    `;

    if (
      admins.length === 0 ||
      admins[0].role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const issueId = body.issueId;
    const status = body.status;

    if (!issueId || !status) {
      return NextResponse.json(
        { error: "Issue ID and status are required" },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "reported",
      "in_review",
      "assigned",
      "in_progress",
      "resolved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // UPDATE ISSUE
    // -----------------------------------------

    if (status === "resolved") {
      await sql`
        UPDATE issues
        SET
          status = 'resolved',
          resolved_at = NOW(),
          updated_at = NOW()
        WHERE id = ${issueId}
      `;
    } else {
      await sql`
        UPDATE issues
        SET
          status = ${status},
          updated_at = NOW()
        WHERE id = ${issueId}
      `;
    }

    // -----------------------------------------
    // SAVE STATUS HISTORY
    // -----------------------------------------

    await sql`
      INSERT INTO issue_status_history (
        id,
        issue_id,
        status,
        changed_by,
        changed_at
      )
      VALUES (
        gen_random_uuid(),
        ${issueId},
        ${status},
        ${adminId},
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: "Issue status updated successfully",
    });

  } catch (error) {
    console.error(
      "Issue status update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update issue status",
      },
      { status: 500 }
    );
  }
}