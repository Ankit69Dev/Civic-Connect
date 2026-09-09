import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

const VALID_STATUSES = [
  "reported",
  "in_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
];

function getNotificationMessage(status: string, title: string) {
  switch (status) {
    case "reported":
      return `Your complaint "${title}" has been marked as reported.`;

    case "in_review":
      return `Your complaint "${title}" is now under review.`;

    case "assigned":
      return `Your complaint "${title}" has been assigned to an officer.`;

    case "in_progress":
      return `Work has started on your complaint "${title}".`;

    case "resolved":
      return `Your complaint "${title}" has been resolved.`;

    case "rejected":
      return `Your complaint "${title}" has been rejected.`;

    default:
      return `The status of your complaint "${title}" has been updated.`;
  }
}

export async function PATCH(request: Request) {
  try {
    // --------------------------------
    // 1. Check logged-in admin
    // --------------------------------
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

    // --------------------------------
    // 2. Read request
    // --------------------------------
    const body = await request.json();

    const issueId = body.issueId;
    const status = body.status;

    if (!issueId || !status) {
      return NextResponse.json(
        { error: "issueId and status are required." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid issue status." },
        { status: 400 }
      );
    }

    // --------------------------------
    // 3. Find issue + citizen
    // --------------------------------
    const issues = await sql`
      SELECT
        id,
        title,
        reporter_id
      FROM issues
      WHERE id = ${issueId}
      LIMIT 1
    `;

    if (issues.length === 0) {
      return NextResponse.json(
        { error: "Issue not found." },
        { status: 404 }
      );
    }

    const issue = issues[0];

    // --------------------------------
    // 4. Update issue status
    // --------------------------------
    const updatedIssues = await sql`
      UPDATE issues
      SET
        status = ${status},
        updated_at = NOW(),
        resolved_at = CASE
          WHEN ${status} = 'resolved' THEN NOW()
          ELSE NULL
        END
      WHERE id = ${issueId}
      RETURNING
        id,
        title,
        status,
        priority,
        updated_at AS "updatedAt",
        resolved_at AS "resolvedAt"
    `;

    const updatedIssue = updatedIssues[0];

    // --------------------------------
    // 5. Add status history
    // --------------------------------
    await sql`
      INSERT INTO issue_status_history (
        id,
        issue_id,
        status,
        note,
        changed_by,
        changed_at
      )
      VALUES (
        ${crypto.randomUUID()},
        ${issueId},
        ${status},
        ${`Status changed to ${status}`},
        ${session.user.id},
        NOW()
      )
    `;

    // --------------------------------
    // 6. CREATE CITIZEN NOTIFICATION
    // --------------------------------
    const message = getNotificationMessage(
      status,
      issue.title
    );

    await sql`
      INSERT INTO notifications (
        id,
        user_id,
        issue_id,
        message,
        is_read,
        created_at
      )
      VALUES (
        ${crypto.randomUUID()},
        ${issue.reporter_id},
        ${issueId},
        ${message},
        false,
        NOW()
      )
    `;

    console.log("NOTIFICATION CREATED:", {
      userId: issue.reporter_id,
      issueId,
      status,
      message,
    });

    // --------------------------------
    // 7. Return success
    // --------------------------------
    return NextResponse.json({
      success: true,
      issue: updatedIssue,
      notification: {
        message,
      },
    });
  } catch (error) {
    console.error("Admin status update error:", error);

    return NextResponse.json(
      { error: "Failed to update issue status." },
      { status: 500 }
    );
  }
}