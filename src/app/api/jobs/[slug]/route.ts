import { getCountryBySlug, getCountryJobs } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = getCountryJobs(country.code);
  if (!data) return NextResponse.json({ error: "No data" }, { status: 404 });
  return NextResponse.json(data);
}
