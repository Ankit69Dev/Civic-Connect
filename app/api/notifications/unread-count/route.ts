import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        unreadCount: 0,
      });
    }

    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE user_id = ${session.user.id}
        AND is_read = false
    `;

    return NextResponse.json({
      unreadCount: result[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("Unread notification count error:", error);

    return NextResponse.json(
      {
        error: "Failed to get unread notification count.",
      },
      { status: 500 }
    );
  }
}