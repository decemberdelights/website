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

function checkSuperAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const sessionMatch = cookie.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  const payload = decodeToken(sessionMatch[1]);
  if (!payload || payload.type !== "admin") return null;
  const db = getDb();
  const user = db.prepare("SELECT role FROM admin_users WHERE id = ?").get(payload.sub) as { role: string } | undefined;
  if (!user || user.role !== "super_admin") return null;
  return payload;
}

const TABLE_MAP: Record<string, string> = {
  franchise: "franchise_applications",
  careers: "career_applications",
  contacts: "contact_messages",
};

const VALID_STATUSES = ["pending", "submitted", "approved", "rejected"];

export async function PUT(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { type, id } = await params;
  const table = TABLE_MAP[type];
  if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const body = await request.json();
  const status = body.status;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(`UPDATE ${table} SET status=?, admin_notes=? WHERE id=?`).run(status, String(body.admin_notes || "").slice(0, 2000), id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  if (!checkSuperAdmin(request)) return NextResponse.json({ error: "Super admin access required" }, { status: 403 });
  const { type, id } = await params;
  const table = TABLE_MAP[type];
  if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const db = getDb();
  db.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
  return NextResponse.json({ ok: true });
}
