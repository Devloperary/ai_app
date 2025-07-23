import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // MongoDB URI from .env
const dbName = "Ai-chat"; // Your database name (as shown in MongoDB Compass)

let cachedClient = null;

async function connectToDB() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(req) {
  try {
    const { name, messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: "Invalid messages format" }, { status: 400 });
    }

    const client = await connectToDB();
    const db = client.db(dbName);
    const collection = db.collection("chats");

    await collection.insertOne({
      name: name || `Chat-${Date.now()}`,
      messages,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MongoDB Save Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
