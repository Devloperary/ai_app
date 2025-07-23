// app/api/chats/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "Ai-chat";

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const chats = await db.collection("chats").find().toArray();

    return NextResponse.json(chats); // Return the data as JSON
  } catch (err) {
    console.error("Error fetching chats:", err);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  } finally {
    await client.close();
  }
}
