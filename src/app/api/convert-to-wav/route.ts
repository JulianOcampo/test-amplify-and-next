import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fileUrl } = await request.json();
    if (!fileUrl) {
      return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 });
    }

    const lambdaUrl = process.env.CONVERT_WAV_LAMBDA_URL!;
    const lambdaRes = await fetch(lambdaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });

    if (!lambdaRes.ok) {
      const errText = await lambdaRes.text();
      return NextResponse.json({ error: errText }, { status: lambdaRes.status });
    }

    const bufferBase64 = await lambdaRes.text();
    const buffer = Buffer.from(bufferBase64, "base64");

    return new NextResponse(buffer, {
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
