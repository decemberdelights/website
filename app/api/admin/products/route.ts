import { NextResponse } from "next/server";
import { getDb, decodeToken } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "backend", "uploads", "products");
const MAX_SIZE = 15 * 1024 * 1024;

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
  const products = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
  return NextResponse.json(products);
}

async function saveFile(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/products/${filename}`;
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const name = formData.get("name") as string || "";
  const description = formData.get("description") as string || "";
  const price = parseFloat(formData.get("price") as string) || 0;
  const original_price = parseFloat(formData.get("original_price") as string) || 0;
  const category = formData.get("category") as string || "";
  const stock = parseInt(formData.get("stock") as string) || 0;
  const is_active = formData.get("is_active") === "true" ? 1 : 0;
  const offer = formData.get("offer") as string || "";
  const file = formData.get("image") as File | null;

  let image_url = formData.get("existing_image_url") as string || "";
  if (file && file.size > 0) {
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Image must be under 15MB" }, { status: 400 });
    image_url = await saveFile(file);
  }

  const db = getDb();
  const result = db.prepare(
    "INSERT INTO products (name, description, price, original_price, category, image_url, stock, is_active, offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(name, description, price, original_price, category, image_url, stock, is_active, offer);
  return NextResponse.json({ id: result.lastInsertRowid, image_url });
}

export async function PUT(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const formData = await request.formData();
  const name = formData.get("name") as string || "";
  const description = formData.get("description") as string || "";
  const price = parseFloat(formData.get("price") as string) || 0;
  const original_price = parseFloat(formData.get("original_price") as string) || 0;
  const category = formData.get("category") as string || "";
  const stock = parseInt(formData.get("stock") as string) || 0;
  const is_active = formData.get("is_active") === "true" ? 1 : 0;
  const offer = formData.get("offer") as string || "";
  const file = formData.get("image") as File | null;

  let image_url = formData.get("existing_image_url") as string || "";
  if (file && file.size > 0) {
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Image must be under 15MB" }, { status: 400 });
    image_url = await saveFile(file);
  }

  const db = getDb();
  db.prepare(
    "UPDATE products SET name=?, description=?, price=?, original_price=?, category=?, image_url=?, stock=?, is_active=?, offer=? WHERE id=?"
  ).run(name, description, price, original_price, category, image_url, stock, is_active, offer, id);
  return NextResponse.json({ ok: true, image_url });
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const db = getDb();
  db.prepare("DELETE FROM products WHERE id=?").run(id);
  return NextResponse.json({ ok: true });
}
