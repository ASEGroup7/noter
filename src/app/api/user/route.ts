import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET(req : NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get("id");

    if(!id) return NextResponse.json({ error: "An id is required"} , { status: 400 });
  
    const user = await clerkClient.users.getUser(id);
    if(!user) return NextResponse.json({ error: "Invalid user id"}, { status: 404 });
    
    return NextResponse.json({ message : "Successfully fetched user data", user });
  
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}
