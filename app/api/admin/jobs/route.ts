import { NextResponse } from "next/server";
import { getDb, decodeToken } from "@/lib/db";

function checkSuperAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const sessionMatch = cookie.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  const payload = decodeToken(sessionMatch[1]);
  if (!payload || payload.type !== "admin" || payload.role !== "super_admin") return null;
  return payload;
}

export async function GET() {
  const db = getDb();
  const jobs = db.prepare("SELECT * FROM jobs ORDER BY id DESC").all();
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  if (!checkSuperAdmin(request)) return NextResponse.json({ error: "Super admin only" }, { status: 403 });
  const body = await request.json();
  const { title, department, location, description, is_active } = body;
  const job_type = body.job_type || body.type || "full-time";

  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const db = getDb();
  const result = db.prepare(
    "INSERT INTO jobs (title, department, location, description, job_type, is_active) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(title, department || "", location || "", description || "", job_type, is_active !== false ? 1 : 0);

  return NextResponse.json({ id: result.lastInsertRowid, ok: true });
}
