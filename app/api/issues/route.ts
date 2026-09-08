import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to report an issue." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      departmentId,
      priority,
      address,
      latitude,
      longitude,
      imageUrl,
    } = body;

    if (
      !title ||
      !description ||
      !departmentId ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const validPriorities = [
      "low",
      "normal",
      "high",
      "critical",
    ];

    const finalPriority = validPriorities.includes(priority)
      ? priority
      : "normal";

    // Make sure department exists
    const department = await sql`
      SELECT id
      FROM departments
      WHERE id = ${departmentId}
      LIMIT 1
    `;

    if (department.length === 0) {
      return NextResponse.json(
        { error: "Invalid department." },
        { status: 400 }
      );
    }

    const issueId = crypto.randomUUID();
    const now = new Date();

    const inserted = await sql`
      INSERT INTO issues (
        id,
        reporter_id,
        department_id,
        title,
        description,
        image_url,
        status,
        priority,
        latitude,
        longitude,
        address,
        upvote_count,
        created_at,
        updated_at
      )
      VALUES (
        ${issueId},
        ${session.user.id},
        ${departmentId},
        ${title.trim()},
        ${description.trim()},
        ${imageUrl || null},
        'reported',
        ${finalPriority},
        ${Number(latitude)},
        ${Number(longitude)},
        ${address.trim()},
        0,
        ${now},
        ${now}
      )
      RETURNING
        id,
        title,
        status,
        priority,
        created_at
    `;

    return NextResponse.json(
      {
        success: true,
        issue: inserted[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create issue error:", error);

    return NextResponse.json(
      { error: "Failed to create issue." },
      { status: 500 }
    );
  }
}