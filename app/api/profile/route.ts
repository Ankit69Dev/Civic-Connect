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

    const users = await sql`
      SELECT
        id,
        name,
        email,
        phone,
        image,
        role,
        provider,
        created_at AS "createdAt"
      FROM users
      WHERE id = ${session.user.id}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: users[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return NextResponse.json(
      { error: "Failed to load profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      );
    }

    const users = await sql`
      UPDATE users
      SET
        name = ${name},
        phone = ${phone || null},
        updated_at = NOW()
      WHERE id = ${session.user.id}

      RETURNING
        id,
        name,
        email,
        phone,
        image,
        role,
        provider,
        created_at AS "createdAt"
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}