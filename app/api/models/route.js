import { NextResponse } from 'next/server';

export async function GET() {
  const { GEMINI_API_KEY } = process.env;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
  const models = await response.json();

  return NextResponse.json(models);
}
