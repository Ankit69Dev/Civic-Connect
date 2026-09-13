import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id: issueId } = await params;

    if (!issueId) {
      return NextResponse.json(
        { error: "Issue ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const verified = body.verified;

    if (typeof verified !== "boolean") {
      return NextResponse.json(
        {
          error: "verified must be true or false.",
        },
        { status: 400 }
      );
    }

    // Find the issue
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

    // Citizens cannot verify their own complaint
    if (issue.reporter_id === session.user.id) {
      return NextResponse.json(
        {
          error:
            "You cannot verify your own complaint.",
        },
        { status: 403 }
      );
    }

    // Check if this citizen has already verified this issue
    const existing = await sql`
      SELECT
        id,
        verified
      FROM issue_verifications
      WHERE issue_id = ${issueId}
        AND user_id = ${session.user.id}
      LIMIT 1
    `;

    let verification;

    if (existing.length > 0) {
      // Update existing verification
      const updated = await sql`
        UPDATE issue_verifications
        SET
          verified = ${verified}
        WHERE id = ${existing[0].id}
        RETURNING
          id,
          issue_id AS "issueId",
          user_id AS "userId",
          verified,
          created_at AS "createdAt"
      `;

      verification = updated[0];
    } else {
      // Create new verification
      const created = await sql`
        INSERT INTO issue_verifications (
          id,
          issue_id,
          user_id,
          verified,
          created_at
        )
        VALUES (
          ${crypto.randomUUID()},
          ${issueId},
          ${session.user.id},
          ${verified},
          NOW()
        )
        RETURNING
          id,
          issue_id AS "issueId",
          user_id AS "userId",
          verified,
          created_at AS "createdAt"
      `;

      verification = created[0];
    }

    // Get updated verification statistics
    const stats = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (
          WHERE verified = true
        )::int AS confirmed,
        COUNT(*) FILTER (
          WHERE verified = false
        )::int AS disputed
      FROM issue_verifications
      WHERE issue_id = ${issueId}
    `;

    const total = stats[0]?.total ?? 0;
    const confirmed = stats[0]?.confirmed ?? 0;
    const disputed = stats[0]?.disputed ?? 0;

    const confidence =
      total > 0
        ? Math.round((confirmed / total) * 100)
        : 0;

    return NextResponse.json({
      success: true,

      verification,

      stats: {
        total,
        confirmed,
        disputed,
        confidence,
      },
    });
  } catch (error) {
    console.error(
      "Issue verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to submit issue verification.",
      },
      { status: 500 }
    );
  }
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id: issueId } = await params;

    if (!issueId) {
      return NextResponse.json(
        { error: "Issue ID is required." },
        { status: 400 }
      );
    }

    // Check that the issue exists
    const issues = await sql`
      SELECT
        id,
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

    // Get verification statistics
    const stats = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (
          WHERE verified = true
        )::int AS confirmed,
        COUNT(*) FILTER (
          WHERE verified = false
        )::int AS disputed
      FROM issue_verifications
      WHERE issue_id = ${issueId}
    `;

    // Get current user's verification
    const userVerification = await sql`
      SELECT
        verified
      FROM issue_verifications
      WHERE issue_id = ${issueId}
        AND user_id = ${session.user.id}
      LIMIT 1
    `;

    const total = stats[0]?.total ?? 0;
    const confirmed = stats[0]?.confirmed ?? 0;
    const disputed = stats[0]?.disputed ?? 0;

    const confidence =
      total > 0
        ? Math.round((confirmed / total) * 100)
        : 0;

    return NextResponse.json({
      success: true,

      stats: {
        total,
        confirmed,
        disputed,
        confidence,
      },

      userVerification:
        userVerification.length > 0
          ? userVerification[0].verified
          : null,

      canVerify:
        issues[0].reporter_id !== session.user.id,
    });
  } catch (error) {
    console.error(
      "Get issue verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to get verification data.",
      },
      { status: 500 }
    );
  }
}