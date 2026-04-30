import { NextResponse } from "next/server";
import { getTopTags } from "@/utils/blogs";

export const revalidate = 0;
export async function GET(request) {
  try {
    const response = NextResponse.json(getTopTags(10));
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
    return response;
  }
}
