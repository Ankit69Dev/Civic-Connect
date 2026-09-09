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

    const notifications = await sql`
      SELECT
        n.id,
        n.message,
        n.is_read AS "isRead",
        n.created_at AS "createdAt",

        n.issue_id AS "issueId",

        COALESCE(i.title, 'Civic Issue') AS "issueTitle",
        COALESCE(i.status::text, 'reported') AS "issueStatus"

      FROM notifications n

      LEFT JOIN issues i
        ON i.id = n.issue_id

      WHERE n.user_id = ${session.user.id}

      ORDER BY n.created_at DESC
    `;

    const formattedNotifications = notifications.map(
      (notification) => ({
        id: notification.id,
        title: notification.issueTitle,
        message: notification.message,
        type:
          notification.issueStatus === "resolved"
            ? "success"
            : notification.issueStatus === "in_progress"
              ? "status"
              : "issue",
        read: notification.isRead,
        createdAt: notification.createdAt,
        issueId: notification.issueId,
      })
    );

    return NextResponse.json({
      notifications: formattedNotifications,
    });
  } catch (error) {
    console.error("Notifications API error:", error);

    return NextResponse.json(
      { error: "Failed to load notifications." },
      { status: 500 }
    );
  }
}