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
  const q = (sql: string) => (db.prepare(sql).get() as Record<string, number>)[Object.keys(db.prepare(sql).get() as Record<string, number>)[0]];

  const recent_orders = db.prepare("SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5").all();
  const recent_franchise = db.prepare("SELECT id, full_name, email, phone, status, created_at FROM franchise_applications ORDER BY created_at DESC LIMIT 5").all();

  return NextResponse.json({
    franchise_count: q("SELECT COUNT(*) as c FROM franchise_applications"),
    career_count: q("SELECT COUNT(*) as c FROM career_applications"),
    contact_count: q("SELECT COUNT(*) as c FROM contact_messages"),
    menu_count: q("SELECT COUNT(*) as c FROM menu_items"),
    product_count: q("SELECT COUNT(*) as c FROM products"),
    job_opening_count: q("SELECT COUNT(*) as c FROM jobs WHERE is_active = 1"),
    pending_franchise: q("SELECT COUNT(*) as c FROM franchise_applications WHERE status='pending'"),
    pending_careers: q("SELECT COUNT(*) as c FROM career_applications WHERE status='pending'"),
    pending_contacts: q("SELECT COUNT(*) as c FROM contact_messages WHERE status='pending'"),
    submitted_franchise: q("SELECT COUNT(*) as c FROM franchise_applications WHERE status='submitted'"),
    approved_franchise: q("SELECT COUNT(*) as c FROM franchise_applications WHERE status='approved'"),
    rejected_franchise: q("SELECT COUNT(*) as c FROM franchise_applications WHERE status='rejected'"),
    order_count: q("SELECT COUNT(*) as c FROM orders"),
    recent_orders,
    recent_franchise,
  });
}
