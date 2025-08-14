import { NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@amplify/data/resource";

const client = generateClient<Schema>();

export async function POST(request: Request) {
  try {
    const { fileUrl } = await request.json();
    if (!fileUrl) {
      return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 });
    }

    const { data, errors } = await client.queries.convertToWav({ fileUrl });

    if (errors) {
      return NextResponse.json({ error: errors[0].message }, { status: 500 });
    }

    const buffer = Buffer.from(data as string, "base64");
    return new NextResponse(buffer, {
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
