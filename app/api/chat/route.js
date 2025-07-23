import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "Ai-chat";
const geminiApiKey = process.env.GEMINI_API_KEY;

export async function POST(req, { params }) {
  const { id } = params;

  // Validate ObjectId
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid or missing chat ID" }, { status: 400 });
  }

  let client;

  try {
    const body = await req.json();
    const newMessage = body.message;

    if (!newMessage || !newMessage.role || !newMessage.content) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    const chatsCollection = client.db(dbName).collection("chats");

    // Push user message
    const updateRes = await chatsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { messages: newMessage } }
    );

    if (updateRes.matchedCount === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Fetch Gemini response
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: newMessage.content }] }],
      }),
    });

    const rawText = await geminiRes.text();
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse Gemini response:", err);
      return NextResponse.json({ error: "Gemini returned invalid JSON" }, { status: 500 });
    }

    if (parsed.error) {
      console.error("Gemini API error:", parsed.error);
      return NextResponse.json({ error: parsed.error.message }, { status: 500 });
    }

    const reply = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gemini did not respond.";

    // Store assistant reply
    await chatsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { messages: { role: "assistant", content: reply } } }
    );

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("POST /api/chats/[id] failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await client?.close();
  }
}
