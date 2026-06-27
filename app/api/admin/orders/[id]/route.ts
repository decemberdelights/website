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
  const admin = checkAdmin(request);
  if (!admin || admin.role !== "super_admin") return null;
  return admin;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const { status } = body;
  const validStatuses = ["pending", "confirmed", "packed", "ready", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const db = getDb();
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSuperAdmin(request)) return NextResponse.json({ error: "Super admin only" }, { status: 403 });
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM orders WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
