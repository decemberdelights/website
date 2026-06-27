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
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  let orders;
  if (status) {
    orders = db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC").all(status);
  } else {
    orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  }
  return NextResponse.json(orders);
}
