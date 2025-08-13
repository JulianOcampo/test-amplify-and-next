import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { html } = await request.json();
    if (!html) {
      return NextResponse.json({ error: "Missing html" }, { status: 400 });
    }

    const lambdaUrl = process.env.GENERATE_PDF_LAMBDA_URL!;
    const lambdaRes = await fetch(lambdaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!lambdaRes.ok) {
      const errText = await lambdaRes.text();
      return NextResponse.json({ error: errText }, { status: lambdaRes.status });
    }

    const bufferBase64 = await lambdaRes.text();
    const buffer = Buffer.from(bufferBase64, "base64");

    return new NextResponse(buffer, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
