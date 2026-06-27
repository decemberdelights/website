import { NextResponse } from "next/server";
import { getDb, decodeToken } from "@/lib/db";

function checkAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const sessionMatch = cookie.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  const payload = decodeToken(sessionMatch[1]);
  if (!payload || payload.type !== "admin") return null;
  return payload;
}

export async function GET(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  return NextResponse.json({
    franchise: db.prepare("SELECT * FROM franchise_applications ORDER BY created_at DESC").all(),
    careers: db.prepare("SELECT * FROM career_applications ORDER BY created_at DESC").all(),
    contacts: db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all(),
  });
}
