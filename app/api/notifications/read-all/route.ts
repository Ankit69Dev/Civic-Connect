import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function PATCH() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${session.user.id}
        AND is_read = false
    `;

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark all notifications error:", error);

    return NextResponse.json(
      { error: "Failed to mark notifications as read." },
      { status: 500 }
    );
  }
}