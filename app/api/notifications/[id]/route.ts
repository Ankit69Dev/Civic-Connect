import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const updated = await sql`
      UPDATE notifications
      SET is_read = true
      WHERE id = ${id}
        AND user_id = ${session.user.id}

      RETURNING
        id,
        message,
        is_read AS "isRead",
        created_at AS "createdAt",
        issue_id AS "issueId"
    `;

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Notification not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: updated[0],
    });
  } catch (error) {
    console.error("Mark notification error:", error);

    return NextResponse.json(
      { error: "Failed to mark notification as read." },
      { status: 500 }
    );
  }
}