import { NextResponse } from "next/server";

import { generatePdf } from "@amplify/generate-pdf/resource";
import { client } from "@/amplify/data/client";

export async function POST(request: Request) {
  try {

    const { html } = await request.json();
    if (!html) {
      return NextResponse.json({ error: "Missing html" }, { status: 400 });
    }

    // Ejecuta la Lambda y recibe el PDF en base64
    // const { data: pdfBase64 } = await runFunction(generatePdf, { html });

    //const buffer = Buffer.from(pdfBase64, "base64");

    //return new NextResponse(buffer, {
    // headers: { "Content-Type": "application/pdf" },
    // });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
