import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET(req : NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get("id");

    if (id) {
      // Existing logic for fetching a single user
      const user = await clerkClient.users.getUser(id);
      if (!user) return NextResponse.json({ error: "Invalid user id" }, { status: 404 });
      return NextResponse.json({ message: "Successfully fetched user data", user });
    } else {
      // New logic for fetching all users
      const users = await clerkClient.users.getUserList();
      return NextResponse.json({ message: "Successfully fetched all users", users });
    }
  
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error fetching user(s)" }, { status: 500 });
  }
}