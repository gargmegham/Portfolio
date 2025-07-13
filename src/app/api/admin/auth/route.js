import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 },
      );
    }

    // For simple password comparison (you can enhance this with bcrypt)
    const isValid = password === adminPassword;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create a simple session token (in production, use JWT or proper session management)
    const response = NextResponse.json(
      { message: "Authentication successful" },
      { status: 200 },
    );

    // Set a simple session cookie
    response.cookies.set("admin-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 },
  );

  response.cookies.delete("admin-session");
  return response;
}
