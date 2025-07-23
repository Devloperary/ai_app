import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "Ai-chat";

export async function GET(req, { params }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const chat = await client.db(dbName).collection("chats").findOne({ _id: new ObjectId(id) });
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    return NextResponse.json({ name: chat.name, messages: chat.messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req, { params }) {
  const { id } = params;
  const client = new MongoClient(uri);

  try {
    const { message } = await req.json();

    if (!message?.role || !message?.content) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const chats = db.collection("chats");

    // Add user message
    await chats.updateOne({ _id: new ObjectId(id) }, { $push: { messages: message } });

    // Simulate Gemini reply
    const geminiRes = await fetch(`${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message.content }] }],
      }),
    });
    const geminiData = await geminiRes.json();
    const assistantReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

    // Add assistant reply
    await chats.updateOne(
      { _id: new ObjectId(id) },
      { $push: { messages: { role: "assistant", content: assistantReply } } }
    );

    return NextResponse.json({ reply: assistantReply });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
